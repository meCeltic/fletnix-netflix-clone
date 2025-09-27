const express = require('express');
const Content = require('../models/Content');
const auth = require('../middleware/auth');

const router = express.Router();

// IMPORTANT: Stats route MUST come before /:id route to avoid conflicts
// Get content statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const [movieCount, tvShowCount, totalCount, ratedRCount] = await Promise.all([
      Content.countDocuments({ type: 'Movie' }),
      Content.countDocuments({ type: 'TV Show' }),
      Content.countDocuments({}),
      Content.countDocuments({ rating: 'R' })
    ]);

    res.json({
      success: true,
      stats: {
        movies: movieCount,
        tvShows: tvShowCount,
        total: totalCount,
        rRated: ratedRCount
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all unique genres
router.get('/genres', auth, async (req, res) => {
  try {
    // Get all unique genres from listed_in field
    const content = await Content.find({}, 'listed_in').lean();
    
    const genresSet = new Set();
    
    content.forEach(item => {
      if (item.listed_in) {
        // Split by comma and clean up each genre
        const genres = item.listed_in.split(',').map(g => g.trim());
        genres.forEach(genre => {
          if (genre) genresSet.add(genre);
        });
      }
    });
    
    // Convert to sorted array
    const genres = Array.from(genresSet).sort();
    
    res.json({
      success: true,
      genres: genres.slice(0, 50) // Limit to top 50 genres
    });
    
  } catch (error) {
    console.error('Genres fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch genres'
    });
  }
});

// Get all content with pagination, search, and filters
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search = '',
      type = '',
      genre = '',
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    let query = {};

    // Search functionality - search in title, cast, and description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { cast: searchRegex },
        { description: searchRegex }
      ];
    }

    // Type filter
    if (type && (type === 'Movie' || type === 'TV Show')) {
      query.type = type;
    }

    // Genre filter
    if (genre && genre.trim()) {
      query.listed_in = { $regex: genre.trim(), $options: 'i' };
    }

    // Age restriction - users under 18 cannot see R-rated content
    if (req.user.age < 18) {
      query.rating = { $ne: 'R' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries
    const [content, totalCount] = await Promise.all([
      Content.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Content.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      content,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        search,
        type,
        genre,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch content',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get content by ID - MUST come after stats route
router.get('/:id', auth, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ 
        success: false,
        message: 'Content not found' 
      });
    }

    // Age restriction check
    if (req.user.age < 18 && content.rating === 'R') {
      return res.status(403).json({ 
        success: false,
        message: 'This content is restricted for users under 18 years old' 
      });
    }

    res.json({ 
      success: true,
      content 
    });
  } catch (error) {
    console.error('Content detail error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid content ID' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch content details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
