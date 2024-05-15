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

const getAllKindOfRoom = async (req, res) => {
    const myCollection = collection(firestore, "LoaiPhong");
    try {
      const querySnapshot = await getDocs(myCollection);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
      const newList = list.sort((a, b) => a.maLoaiPhong.localeCompare(b.maLoaiPhong));
      res.json({ success: true, kindOfRoom: newList });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong when get data from LoaiPhong",
      });
      console.log(error);
      return [];
    }
  };
  const addKindOfRoom = async (req, res) => {
    try {
      const myCollection = collection(firestore, "LoaiPhong");
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document kind of room successfully add!");
      res.send({
        success: true,
        message: "Kind of room  added successfully",
        docId: docRef.id,
      });
    } catch (error) {
      console.error("Error adding document  kind of room : ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when adding kind of room",
      });
    }
  };
  const updateKindOfRoom = async (req, res) => {
    try {
      const myCollection = collection(firestore, "LoaiPhong");
      const docRef1 = doc(myCollection, req.params.kindofroomId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document kind of room successfully updated!");
      res.send({ success: true, message: "Document successfully updated!" });
    
    } catch (error) {
      console.error("Error updating kind of room document: ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when update document",
      });
    }
  };
  
  const deleteKindOfRoom = async (req, res) => {
    try {
      const documentRef = doc(firestore, "LoaiPhong", req.params.kindofroomId);
      await deleteDoc(documentRef);
      console.log("Document kind of room deleted successfully.");
      res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
      console.log("Error deleting kind of room document:", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when delete document",
      });
    }
  };
  module.exports = {
    getAllKindOfRoom,
    addKindOfRoom,
    updateKindOfRoom,
    deleteKindOfRoom,
  };
  