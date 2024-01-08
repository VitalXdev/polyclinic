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
exports.Appointment = void 0;
const typeorm_1 = require("typeorm");
const Doctor_1 = require("./Doctor");
const Patient_1 = require("./Patient");
const Clinic_1 = require("./Clinic");
let Appointment = class Appointment {
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Appointment.prototype, "appointment_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Appointment.prototype, "appointment_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Appointment.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Appointment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Doctor_1.Doctor, doctor => doctor.appointments),
    __metadata("design:type", Doctor_1.Doctor)
], Appointment.prototype, "doctor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Patient_1.Patient, patient => patient.appointments),
    __metadata("design:type", Patient_1.Patient)
], Appointment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Clinic_1.Clinic, clinic => clinic.appointments),
    __metadata("design:type", Clinic_1.Clinic)
], Appointment.prototype, "clinic", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)()
], Appointment);
