/**
 * These are all the routes for this application:
 *
 * PUBLIC ENDPOINTS:
 * NO AUTHENTICATION AT ALL
 * /user => registering a user
 * /verify => verifying user's account using verifyToken
 * /login => the login process, responsible for authToken and refreshToken
 * /reset/request => for requesting a reset link and resetToken
 * /reset => when the user resets his/her password
 *
 * SEMI-PUBLIC ENDPOINTS:
 * NO AUTHENTICATION BUT REFRESH TOKEN IS REQUIRED
 * /token => request for new authToken using refreshToken
 * /logout => logs out the user using refreshToken
 *
 * PRIVATE ENDPOINTS:
 * AUTHENTICATION IS REQUIRED
 * /add => add a verse or text
 * /verses => get all verses or texts
 * /verse/:id => GET gets specific verse or text
 * /verse/:id => PATCH updates specific verse or text
 * /verse/:id => DELETE deletes specific verse or text
 * /user/me => user's info or profile
 */

import express from 'express';

// Middlewares
import authenticate from '../middlewares/authenticate';
// All Controllers
import userEndpointController from '../controllers/api/user-controller';
import verifyEndpointController from '../controllers/api/verify-controller';
import loginEndpointController from '../controllers/api/login-controller';
import resetRequestEndpointController from '../controllers/api/reset-request-controller';
import resetEndpointController from '../controllers/api/reset-controller';
import addEndpointController from '../controllers/api/add-controller';
import versesEndpointController from '../controllers/api/verses-controller';
import verseGetEndpointController from '../controllers/api/verse-get-controller';
import verseUpdateEndpointController from '../controllers/api/verse-patch-controller';
import verseDeleteEndpointController from '../controllers/api/verse-delete-controller';
import logoutEndpointController from '../controllers/api/logout-controller';
import userMeEndpointController from '../controllers/api/user-me-controller';
import tokenEndpointController from '../controllers/api/token-controller';

// Router instance
const router = express.Router();

// Routes
// Public: No Authentication required
router.post('/user', userEndpointController); // POST
router.get('/verify', verifyEndpointController); // GET
router.post('/login', loginEndpointController); // POST
router.post('/reset/request', resetRequestEndpointController); // POST
router.post('/reset', resetEndpointController); // POST
// Semi-Public: No Authentication but Refresh Token Required
router.post('/token', tokenEndpointController); // POST
router.post('/logout', logoutEndpointController); // POST
// Private: Authentication is required
router.post('/add', authenticate, addEndpointController); // POST
router.get('/verses', authenticate, versesEndpointController); // GET
router.get('/verse/:id', authenticate, verseGetEndpointController); // GET
router.patch('/verse/:id', authenticate, verseUpdateEndpointController); // PATCH
router.delete('/verse/:id', authenticate, verseDeleteEndpointController); // DELETE
router.get('/user/me', authenticate, userMeEndpointController); // GET

export default router;
