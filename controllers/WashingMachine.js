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

const getWashingMachine = async (req, res) => {
  const myCollection = collection(firestore, "LichMayGiat");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    res.json({ success: true, washingMachine: list });
    console.log("Document washing machine successfully get!");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from LichMayGiat",
    });
    console.log(error);
    return [];
  }
};
const addWashingMachine = async (req, res) => {
  try {
    const myCollection = collection(firestore, "LichMayGiat");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document washing machine successfully add!");
    res.send({
      success: true,
      message: "washing machine added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document washing machine: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding washing machine",
    });
  }
};
const updateWashingMachine = async (req, res) => {
  try {
    const myCollection = collection(firestore, "LichMayGiat");
    const docRef1 = doc(myCollection, req.params.Id);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document washing machine successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  
  } catch (error) {
    console.error("Error updating washing machine document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

const deleteWashingMachine = async (req, res) => {
  try {
    const documentRef = doc(firestore, "LichMayGiat", req.params.Id);
    await deleteDoc(documentRef);
    console.log("Document washing machine deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting washing machine document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};
const getWashingMachineBySearch = async (req, res) => {
  const { date } = req.query;
  
  // Kiểm tra định dạng date nếu cần
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Expected format: YYYY-MM-DD",
    });
  }

  const myCollection = collection(firestore, "LichMayGiat");

  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });

    const searchResults = list.filter((w) => {
      return !date || w.date === date;
    });

    const sortList = searchResults.sort((a, b) => a.date.localeCompare(b.date));
    
    res.json({ success: true, washingMachine: sortList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong when getting data from LichMayGiat",
    });
    console.error(error);
  }
};


module.exports = {
  getWashingMachine,
  addWashingMachine,
  updateWashingMachine,
  deleteWashingMachine,
  getWashingMachineBySearch
};
