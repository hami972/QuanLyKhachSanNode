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

const getAllReview = async (req, res) => {
  const myCollection = collection(firestore, "DanhGia");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.soSao.localeCompare(b.soSao));
    res.json({ success: true, review: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from DanhGia",
    });
    console.log(error);
    return [];
  }
};
const getCPHD = async (req, res) => {
  const myCollection = collection(firestore, "CPHD");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.ten.localeCompare(b.ten));
    res.json({ success: true, cphd: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from CPHD",
    });
    console.log(error);
    return [];
  }
};
const addReview = async (req, res) => {
  try {
    const myCollection = collection(firestore, "DanhGia");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document review successfully add!");
    res.send({
      success: true,
      message: "review added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document review: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding review",
    });
  }
};
const updateReview = async (req, res) => {
  try {
    const myCollection = collection(firestore, "DanhGia");
    const docRef1 = doc(myCollection, req.params.Id);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document review successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  
  } catch (error) {
    console.error("Error updating review document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const documentRef = doc(firestore, "DanhGia", req.params.Id);
    await deleteDoc(documentRef);
    console.log("Document review deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting review document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};
module.exports = {
  getAllReview,
  addReview,
  updateReview,
  deleteReview,
  getCPHD,
};
