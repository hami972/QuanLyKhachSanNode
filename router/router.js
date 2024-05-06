const express = require("express");
const router = express.Router();
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

module.exports = router;