import { Router } from 'express';
import { ExperienceService } from '../services/experienceService';
import { createError } from '../middleware/errorHandler';

const router = Router();
const experienceService = new ExperienceService();

// GET /experiences - Get all experiences
router.get('/', async (req, res, next) => {
  try {
    const experiences = await experienceService.getAllExperiences();
    res.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    next(error);
  }
});

// GET /experiences/:id - Get experience by ID with slots
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const experience = await experienceService.getExperienceById(id);
    
    if (!experience) {
      throw createError('Experience not found', 404);
    }

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    next(error);
  }
});

// GET /experiences/:id/slots - Get slots for specific experience
router.get('/:id/slots', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    
    const slots = await experienceService.getExperienceSlots(id, date as string);
    
    res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    next(error);
  }
});

export default router;