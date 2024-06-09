const express = require("express");
const router = express.Router();

const {
  addDocument,
  deleteDocument,
  updateDocument,
  getAllDocuments,
} = require("../controllers/Schedule");
//user
const {
  setUserInfo,
  addUser,
  SignIn,
  sendEmail,
  checkUserName,
  updateUser,
  getUserData,
  findStaffbymaNV,
  deleteUser,
} = require("../controllers/User");
//user
router.put("/setUserInfo/:userId", setUserInfo);
router.post("/addUser", addUser);
router.post("/sendEmail", sendEmail);
router.get("/SignIn/:name/:pass", SignIn);
router.get("/checkUserName/:name", checkUserName);
router.get("/UserData/:userId", getUserData);
router.put("/updateUser/:userId", updateUser);
router.get("/findAccountofStaff/:maNV", findStaffbymaNV);
router.delete("/deleteUserAccount/:Id", deleteUser);
//Staff
const {
  getAllStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
  getStaffsBySearch,
} = require("../controllers/Staff");
//Staff
router.get("/StaffManagement/getStaffs", getAllStaffs);
router.get("/StaffManagement/Staffs", getStaffsBySearch);
router.post("/StaffManagement/add", addStaff);
router.put("/StaffManagement/update/:staffId", updateStaff);
router.delete("/StaffManagement/delete/:staffId", deleteStaff);
router.get("/StaffManagement/getAll/:dataName", getAllDocuments);
router.post("/StaffManagement/add/:dataName", addDocument);
router.put("/StaffManagement/:dataName/update/:id", updateDocument);
router.delete("/StaffManagement/:dataName/delete/:id", deleteDocument);


//Branch
const {
  getAllBranchs,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchsBySearch,
} = require("../controllers/Branch");
router.get("/BranchManagement/getBranchs", getAllBranchs);
router.get("/BranchManagement/Branchs", getBranchsBySearch);
router.post("/BranchManagement/add", addBranch);
router.put("/BranchManagement/update/:branchId", updateBranch);
router.delete("/BranchManagement/delete/:branchId", deleteBranch);
//Discount
const {
  getAllDiscount,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountsBySearch,
} = require("../controllers/Discount");
router.get("/DiscountManagement/getDiscounts", getAllDiscount);
router.post("/DiscountManagement/add", addDiscount);
router.put("/DiscountManagement/update/:discountId", updateDiscount);
router.delete("/DiscountManagement/delete/:discountId", deleteDiscount);
router.get("/DiscountManagement/Discounts", getDiscountsBySearch);
//Bill
const {
  getAllBills,
  addBill,
  updateBill,
  deleteBill,
  getBillsBySearch,
} = require("../controllers/Bill");
//Bill
router.get("/BillManagement/getBills", getAllBills);
router.post("/BillManagement/add", addBill);
router.put("/BillManagement/update/:billId", updateBill);
router.delete("/BillManagement/delete/:billId", deleteBill);
router.get("/BillManagement/Bills", getBillsBySearch);

//KindOfRoom 
const {
  getAllKindOfRoom,
  addKindOfRoom,
  updateKindOfRoom,
  deleteKindOfRoom,
} = require("../controllers/Rooms");
//KindOfRoom 
router.get("/KindOfRoom/getKindOfRoom", getAllKindOfRoom);
router.post("/KindOfRoom/add", addKindOfRoom);
router.put("/KindOfRoom/update/:kindofroomId", updateKindOfRoom);
router.delete("/KindOfRoom/delete/:kindofroomId", deleteKindOfRoom);


//Floor 
const {
  getAllFloors,
  addFloor,
  updateFloor,
  deleteFloor,
} = require("../controllers/Floor");
//Floor 
router.get("/Floor/getFloors", getAllFloors);
router.post("/Floor/add", addFloor);
router.put("/Floor/update/:floorId", updateFloor);
router.delete("/Floor/delete/:floorId", deleteFloor);

//BookedRoom
const {
  getAllBookedRoom,
  addBookedRoom,
  updateBookedRoom,
  deleteBookedRoom,
  getBookedRoomBySearch
} = require("../controllers/BookedRoom");
router.get("/BookedRoom/getBookedRoom", getAllBookedRoom);
router.post("/BookedRoom/add", addBookedRoom);
router.put("/BookedRoom/update/:bookedRoomId", updateBookedRoom);
router.delete("/BookedRoom/delete/:bookedRoomId", deleteBookedRoom);
router.get("/BookedRoom/bookedRoom", getBookedRoomBySearch);

//Review
const {
  getAllReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/Review");
//Review 
router.get("/Review/getReview", getAllReview);
router.post("/Review/add", addReview);
router.put("/Review/update/:reviewId", updateReview);
router.delete("/Review/delete/:reviewId", deleteReview);

//materialused
const {
  getMaterialUsedBySearch,
  getMaterialsUsed,
  updateMaterialUsed,
  deleteMaterialUsed,
  addMaterialUsed,
} = require("../controllers/MaterialUsed");
router.get("/MaterialUsed/get", getMaterialsUsed);
router.get("/MaterialUsed/search", getMaterialUsedBySearch);
router.post("/MaterialUsed/add", addMaterialUsed);
router.put("/MaterialUsed/update/:Id", updateMaterialUsed);
router.delete("/MaterialUsed/delete/:Id", deleteMaterialUsed);

// Material
const { addMaterial, getAllMaterials, updateMaterial, getMaterialsBySearch, deleteMaterial } = require("../controllers/Material");
router.post("/Material/add", addMaterial)
router.get("/Material/get", getAllMaterials);
router.put("/Material/update/:Id", updateMaterial);
router.delete("/Material/delete/:Id", deleteMaterial);
router.get("/Material/search", getMaterialsBySearch);

// Receiving Stock
const { addReceivingStock, getReceivingStock, getReceivingStockBySearch, deleteReceivingStock, updateReceivingStock }
  = require("../controllers/ReceivingStock");
router.post("/ReceivingStock/add", addReceivingStock)
router.get("/ReceivingStock/get", getReceivingStock);
router.get("/ReceivingStock/search", getReceivingStockBySearch);
router.put("/ReceivingStock/update/:Id", updateReceivingStock);
router.delete("/ReceivingStock/delete/:Id", deleteReceivingStock);

// Damaged Material
const { addDamagedMaterial, getDamagedMaterial, getDamagedMaterialBySearch, deleteDamagedMaterial, updateDamagedMaterial } =
  require("../controllers/DamagedMaterial");
router.post("/DamagedMaterial/add", addDamagedMaterial)
router.get("/DamagedMaterial/get", getDamagedMaterial);
router.put("/DamagedMaterial/update/:Id", updateDamagedMaterial);
router.delete("/DamagedMaterial/delete/:Id", deleteDamagedMaterial);
router.get("/DamagedMaterial/search", getDamagedMaterialBySearch);

const {
  getWashingMachine,
  addWashingMachine,
  updateWashingMachine,
  deleteWashingMachine,
  getWashingMachineBySearch,
} = require("../controllers/WashingMachine");
//washignmachine
router.get("/WashingMachine/get", getWashingMachine);
router.get("/WashingMachine/search", getWashingMachineBySearch);
router.post("/WashingMachine/add", addWashingMachine);
router.put("/WashingMachine/update/:Id", updateWashingMachine);
router.delete("/WashingMachine/delete/:Id", deleteWashingMachine);

//Block
const {
  getAllBlocks,
  addBlock,
  updateBlock,
  deleteBlock
} = require("../controllers/Block");
router.get("/Block/get", getAllBlocks);
router.post("/Block/add", addBlock);
router.put("/Block/update/:blockId", updateBlock);
router.delete("/Block/delete/:blockId", deleteBlock);

module.exports = router;