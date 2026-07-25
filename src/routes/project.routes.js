import {Router} from "express"
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembersToProject,
  getProjectMembersProject,
  updateMemberRole,
  deleteMember,
} from "../controllers/project.controller.js";

import { validate } from "../middlewares/validator.middleware.js"
import { 
    createProjectValidator,
    addMemberToProjectValidator
} from "../validators/index.validator.js"
import {
  verifyJWT,
  validateProjectpermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRoles } from "../utils/constants.js";
const router = Router();
router.use(verifyJWT);

router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject);
router
    .route("/:projectId")
    .get(validateProjectpermission(AvailableUserRoles), getProjectById)
    .put(validateProjectpermission([UserRolesEnum.ADMIN]),createProjectValidator(), validate, updateProject)
    .delete(
        validateProjectpermission([UserRolesEnum.ADMIN]),
        deleteProject
    );


router
    .route("/:projectId/members/")
    .get(getProjectMembers)
    .post(
        validateProjectpermission([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMembersToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectpermission([UserRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(validateProjectpermission([UserRolesEnum.ADMIN]), deleteMember);


export default router