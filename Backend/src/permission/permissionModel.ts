import mongoose, { Schema } from "mongoose";

const rolePermissionSchema = new Schema(
  {
    workspaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    roleName: {
      type: String,
      enum: ["owner", "admin", "manager", "editor", "viewer"],
      required: true,
    },
    permissions: [{ type: String, enum: Object.values(Permission) }],
  },
  { timestamps: true }
);
export const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);
