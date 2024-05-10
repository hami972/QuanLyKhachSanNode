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
module.exports = router;