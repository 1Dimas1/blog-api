import mongoose from "mongoose";
import {EmailConfirmationType, PasswordRecoveryType, UserType} from "./user.type";

const emailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>(
    {
        confirmationCode: {
            type: String,
            default: null,
        },
        expirationDate: {
            type: Date,
            default: null,
        },
        isConfirmed: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { _id: false }
)

const passwordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>(
    {
        recoveryCode: {
            type: String,
            default: null,
        },
        expirationDate: {
            type: Date,
            default: null,
        },
    },
    { _id: false }
)

export const userSchema = new mongoose.Schema<UserType>(
    {
        login: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 10,
            match: /^[a-zA-Z0-9_-]*$/,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}$/,
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: () => new Date(),
            immutable: true,
        },
        emailConfirmation: {
            type: emailConfirmationSchema,
            required: true,
        },
        passwordRecovery: {
            type: passwordRecoverySchema,
            required: false,
        },
    }
)