const {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
  } = require("firebase/firestore");
  const { firebase } = require("../config");
  const firestore = getFirestore(firebase);
  
  const addBranch = async (req, res) => {
    try {
      const myCollection = collection(firestore, "ChiNhanh");
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document branch successfully add!");
      res.send({
        success: false,
        message: "Branch added successfully",
        docId: docRef.id,
      });
    } catch (error) {
      console.error("Error adding document branch: ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when adding branch",
      });
    }
  };
  const getAllBranchs = async (req, res) => {
    const myCollection = collection(firestore, "ChiNhanh");
    try {
      const querySnapshot = await getDocs(myCollection);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
      const newList = list.sort((a, b) =>
        a.maChiNhanh.localeCompare(b.maChiNhanh)
      );
      res.json({ success: true, branchs: newList });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong when get data from ChiNhanh",
      });
      console.log(error);
      return [];
    }
  };
  const updateBranch = async (req, res) => {
    try {
      const myCollection = collection(firestore, "ChiNhanh");
      const docRef1 = doc(myCollection, req.params.branchId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document branch successfully updated!");
      res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
      console.error("Error updating branch document: ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when update document",
      });
    }
  };
  const deleteBranch = async (req, res) => {
    try {
      const documentRef = doc(firestore, "ChiNhanh", req.params.branchId);
      await deleteDoc(documentRef);
      console.log("Document branch deleted successfully.");
      res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
      console.log("Error deleting branch document:", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when delete document",
      });
    }
  };
  const getBranchsBySearch = async (req, res) => {
    const { maChiNhanh, tenChiNhanh, slpDau, slpCuoi } = req.query;
    const myCollection = collection(firestore, "ChiNhanh");
    try {
      const querySnapshot = await getDocs(myCollection);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
      const searchResults = list.filter((chiNhanh) => {
        const normalizeText = (text) => text.toLowerCase();
  
        const matchMaChiNhanh =
          maChiNhanh === "" ||
          normalizeText(chiNhanh.maChiNhanh).includes(normalizeText(maChiNhanh));
        const matchTenChiNhanh =
          tenChiNhanh === "" ||
          normalizeText(chiNhanh.tenChiNhanh).includes(
            normalizeText(tenChiNhanh)
          );
  
        const matchSoLuongPhong =
          (slpDau == "" && slpCuoi == "") ||
          (slpDau != "" &&
            parseFloat(chiNhanh.soLuongPhong) >= parseFloat(slpDau) &&
            slpCuoi == "") ||
          (slpCuoi != "" &&
            parseFloat(chiNhanh.soLuongPhong) <= parseFloat(slpCuoi) &&
            slpDau == "") ||
          (slpDau != "" &&
            slpCuoi != "" &&
            parseFloat(chiNhanh.soLuongPhong) >= parseFloat(slpDau) &&
            parseFloat(chiNhanh.soLuongPhong) <= parseFloat(slpCuoi));
  
        return matchMaChiNhanh && matchTenChiNhanh && matchSoLuongPhong;
      });
      const sortList = searchResults.sort((a, b) =>
        a.maChiNhanh.localeCompare(b.maChiNhanh)
      );
      res.json({ success: true, branchs: sortList });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong when get data from ChiNhanh",
      });
      console.log(error);
      return [];
    }
  };
  
  module.exports = {
    addBranch,
    getAllBranchs,
    updateBranch,
    deleteBranch,
    getBranchsBySearch,
  };
  