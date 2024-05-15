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

const getTreatmentRecordDetailById = async (req, res) => {
  const myCollection = collection(firestore, "ChiTietHSDT");
  const docRef = doc(myCollection, req.params.cthsdtId).id;
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      if (doc.id === docRef) {
        const data = doc.data();
        res.json({ success: true, cthsdtById: data });
        return data;
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from ChiTietHSDT",
    });
    console.log(error);
    return [];
  }
};

module.exports = { getTreatmentRecordDetailById };
