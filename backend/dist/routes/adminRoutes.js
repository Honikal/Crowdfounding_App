"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Acá manejaremos todas las rutas de importancia relacionadas con usuario
const express_1 = require("express");
const deactivateProjController_1 = require("../controller/admin/deactivateProjController");
const deactivateAccController_1 = require("../controller/admin/deactivateAccController");
const asignModController_1 = require("../controller/admin/asignModController");
const router = (0, express_1.Router)();
//Hacemos routing para el logging del usuario
router.post('/deactivateProject', deactivateProjController_1.deactivateProjController);
router.post('/deactivateAccount', deactivateAccController_1.deactivateAccController);
router.post('/asignMod', asignModController_1.asignModController);
exports.default = router;
