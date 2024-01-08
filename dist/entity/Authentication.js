"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const typeorm_1 = require("typeorm");
let Authentication = class Authentication {
};
exports.Authentication = Authentication;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Authentication.prototype, "contact_info_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Authentication.prototype, "last_otp", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Authentication.prototype, "hashed_password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Authentication.prototype, "last_authenticated_at", void 0);
exports.Authentication = Authentication = __decorate([
    (0, typeorm_1.Entity)()
], Authentication);
