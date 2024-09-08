/** Byimaan */

import express from 'express';
import { getAnotherTest, getTest } from '@/controllers/index';


export const router = express.Router();


router.get('/test', getTest);
router.get('/another-test', getAnotherTest);