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
exports.Hospital = void 0;
const typeorm_1 = require("typeorm");
let Hospital = class Hospital {
};
exports.Hospital = Hospital;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Hospital.prototype, "hospital_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hospital.prototype, "hospital_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Hospital.prototype, "hospital_address_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hospital.prototype, "hospital_qr_code_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Hospital.prototype, "hospital_contact_info_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Hospital.prototype, "hospital_org_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Hospital.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Hospital.prototype, "updated_at", void 0);
exports.Hospital = Hospital = __decorate([
    (0, typeorm_1.Entity)()
], Hospital);
