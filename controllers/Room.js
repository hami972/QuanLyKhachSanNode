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

const getAllBookedRoom = async (req, res) => {
    const myCollection = collection(firestore, "PhongDaDat");
    try {
      const querySnapshot = await getDocs(myCollection);
      const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
      const newList = list.sort((a, b) => a.tenPhong.localeCompare(b.tenPhong));
      res.json({ success: true, bookedRoom: newList });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong when get data from PhongDaDat",
      });
      console.log(error);
      return [];
    }
  };
  const addBookedRoom = async (req, res) => {
    try {
      const myCollection = collection(firestore, "PhongDaDat");
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document kind of room successfully add!");
      res.send({
        success: true,
        message: "booked room added successfully",
        docId: docRef.id,
      });
    } catch (error) {
      console.error("Error adding document booked room: ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when adding booked room",
      });
    }
  };
  const updateBookedRoom = async (req, res) => {
    try {
      const myCollection = collection(firestore, "PhongDaDat");
      const docRef1 = doc(myCollection, req.params.tenPhong);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document booked room successfully updated!");
      res.send({ success: true, message: "Document successfully updated!" });
    
    } catch (error) {
      console.error("Error updating booked room document: ", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when update document",
      });
    }
  };
  
  const deleteBookedRoom = async (req, res) => {
    try {
      const documentRef = doc(firestore, "PhongDaDat", req.params.tenPhong);
      await deleteDoc(documentRef);
      console.log("Document booked room deleted successfully.");
      res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
      console.log("Error deleting booked room document:", error);
      res.status(500).json({
        success: false,
        message: "something went wrong when delete document",
      });
    }
  };
  module.exports = {
    getAllBookedRoom,
    addBookedRoom,
    updateBookedRoom,
    deleteBookedRoom,
  };
  