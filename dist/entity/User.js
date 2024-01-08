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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Appointment_1 = require("./Appointment");
const Doctor_1 = require("./Doctor");
const Patient_1 = require("./Patient");
const Staff_1 = require("./Staff");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "contact_info_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointment_1.Appointment, appointment => appointment.patient),
    __metadata("design:type", Array)
], User.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Doctor_1.Doctor, doctor => doctor.user),
    __metadata("design:type", Array)
], User.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Patient_1.Patient, patient => patient.user),
    __metadata("design:type", Array)
], User.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Staff_1.Staff, staff => staff.user),
    __metadata("design:type", Array)
], User.prototype, "staff", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
