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

const getAllWashingMachine = async (req, res) => {
    const myCollection = collection(firestore, "LichMayGiat");
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
      const docRef1 = doc(myCollection, req.params.tenPhong);
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
      const documentRef = doc(firestore, "LichMayGiat", req.params.tenPhong);
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
  module.exports = {
    getAllWashingMachine,
    addWashingMachine,
    updateWashingMachine,
    deleteWashingMachine,
  };
  