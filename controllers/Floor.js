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

const getAllFloors = async (req, res) => {
  const myCollection = collection(firestore, "Tang");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.maTang.localeCompare(b.maTang));
    res.json({ success: true, tang: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from Tang",
    });
    console.log(error);
    return [];
  }
};
const addFloor = async (req, res) => {
  try {
    const myCollection = collection(firestore, "Tang");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document floor successfully add!");
    res.send({
      success: true,
      message: "Floor added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document floor: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding floor",
    });
  }
};
const updateFloor = async (req, res) => {
  try {
    const myCollection = collection(firestore, 'Tang');
    const docRef1 = doc(myCollection, req.params.floorId);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document floor successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });

  } catch (error) {
    console.error("Error updating floor document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

const deleteFloor = async (req, res) => {
  try {
    const documentRef = doc(firestore, "Tang", req.params.kingofroomId);
    await deleteDoc(documentRef);
    console.log("Document floor deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting floor document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};
module.exports = {
  getAllFloors,
  addFloor,
  updateFloor,
  deleteFloor,
};
