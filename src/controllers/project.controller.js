import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import mongoose from "mongoose";
import { UserRolesEnum } from "../utils/constants.js";


const getProjects = asyncHandler(async (req, res) => {
    const project = await ProjectMember.aggregate(
    [{
        $match : {
            user:new mongoose.Types.ObjectId(req.user._id),
        }
    },
    {
        $lookup:{
            from: "projects",
            localField :"project",
            foreignField : "_id",
            as: "projects",
            pipeline:[{
                $lookup :{
                    from: "projectmembers",
                    localField : "_id",
                    foreignField : "projects",
                    as:"projectmembers"
                }
            },
            {
                $addFields : {
                    members:{
                        $size : "$projectmembers"
                    }
                }
            }
        ]
        }
    },
    {
        $unwind : "$project"
    },
    {
        $project :{
            project:{
                _id: 1,
                name : 1,
                description : 1,
                members : 1,
                createdAt: 1,
                createdBy : 1
            },
            role :1,
            _id :0
        }
    }
]
)

    return res.status(200).json(new ApiResponse(200, project , "project fetched successfully"));
})

const getProjectById = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if(!project){
        throw new ApiError(404,"project not found")
    }
    return res.status(200).json(new ApiResponse(200, project, "project fetched successfully"));
})

const createProject = asyncHandler(async (req, res) => {
    const {name,description} = req.body

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id) 
    })

    await ProjectMember.create({
        user : new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role : UserRolesEnum.ADMIN
    })

    return res.status(200).json(new ApiResponse(201,project,"project created successfully"))

    
})

const updateProject = asyncHandler(async (req, res) => {
    const {name,description} = req.body

    const{projectId}  =req.params

    const project = await Project.findById(projectId,{
        name,description
    },{new:true})

    if(!project){
        throw new ApiError(404,"project not found")
    }

    return res.status(200).json(new ApiResponse(200,project,"project updated successfully"))

})
const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project  = await Project.findByIdAndDelete(projectId)
    if(!project){
        throw new ApiError(404,"project not found")
    } 
    return res.status(200).json(new ApiResponse(200,{project},"project deleted successfully"))
})

const addMembersToProject = asyncHandler(async (req, res) => {
    const {email,role,} = req.body
    const {projectId} = req.params

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const projectMember = await ProjectMember.findByIdAndUpdate(
      {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
      },
      {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
        role: role,
      },{
        new : true,
        upsert: true, // Create a new document if it doesn't exist
      }
    );

    return res.status(201).json(new ApiResponse(201, "Member added to project successfully"));
});

const getProjectMembersProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },{
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },{
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] }
            }
        },{
            $project: {
                project: 1,
                role: 1,
                user: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ]);

    return res.status(200).json(new ApiResponse(200, projectMembers, "Project members fetched successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const {newRole} = req.body;

    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400,"Invalid role")
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    });

    if(!projectMember){
        throw new ApiError(404,"Project member not found")
    }

    projectMember.role = newRole;
    await projectMember.save();

    return res.status(200).json(new ApiResponse(200, projectMember, "Member role updated successfully"));
});
const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    const projectMember = await ProjectMember.findOneAndDelete({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    });
    if(!projectMember){
        throw new ApiError(404,"Project member not found")
    }
    return res.status(200).json(new ApiResponse(200, projectMember, "Member deleted successfully"));
})

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembersProject,
    updateMemberRole,
    deleteMember
}


