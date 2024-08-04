"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = void 0;
const user_1 = require("../models/user");
const index_1 = require("../utils/index");
const authorizeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Check if userId is available and fetch user from database
        if (!userId) {
            return (0, index_1.validationMessage)(res, "User not authenticated");
        }
        const user = yield user_1.User.findById(userId);
        if (!user || user.role !== "admin") {
            return (0, index_1.validationMessage)(res, "Access denied");
        }
        next();
    }
    catch (error) {
        (0, index_1.catchMessage)(res);
    }
});
exports.authorizeAdmin = authorizeAdmin;
