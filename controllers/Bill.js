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

const getAllBills = async (req, res) => {
  const myCollection = collection(firestore, "HoaDon");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.maHoaDon.localeCompare(b.maHoaDon));
    res.json({ success: true, bills: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from HoaDon",
    });
    console.log(error);
    return [];
  }
};

const addBill = async (req, res) => {
  try {
    const myCollection = collection(firestore, "HoaDon");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document bill successfully add!");
    res.send({
      success: true,
      message: "Discount added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document bill: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding bill",
    });
  }
};

const updateBill = async (req, res) => {
  try {
    const myCollection = collection(firestore, "HoaDon");
    const docRef1 = doc(myCollection, req.params.billId);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document bill successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error updating bill document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};

const deleteBill = async (req, res) => {
  try {
    const documentRef = doc(firestore, "HoaDon", req.params.billId);
    await deleteDoc(documentRef);
    console.log("Document bill deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting bill document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};

function compareDates(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  if (date1 < date2) {
    return -1; // dateString1 là ngày trước dateString2
  } else if (date1 > date2) {
    return 1; // dateString1 là ngày sau dateString2
  } else {
    return 0; // Hai ngày bằng nhau
  }
}

const getBillsBySearch = async (req, res) => {
  const { maHoaDon, tenKhachHang, ngayLap, tinhTrang } = req.query;
  const myCollection = collection(firestore, "HoaDon");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((hoadon) => {
      const normalizeText = (text) => text.toLowerCase();
      console.log("abc");
      const matchMaHoaDon =
        maHoaDon === "" ||
        normalizeText(hoadon.maHoaDon).includes(normalizeText(maHoaDon));
      const matchTenKhachHang =
        tenBenhNhan === "" ||
        normalizeText(hoadon.tenKhachHang).includes(normalizeText(tenKhachHang));
      const matchNgayLap =
        ngayLap === "" || compareDates(ngayLap, hoadon.ngayLap) == 0;

      const matchTinhTrang = tinhTrang == "" || tinhTrang == hoadon.tinhTrang;
      return (
        matchMaHoaDon &&
        matchtenKhachHang &&
        matchNgayLap &&
        matchTinhTrang
      );
    });
    const sortList = searchResults.sort((a, b) =>
      a.maHoaDon.localeCompare(b.maHoaDon)
    );
    res.json({ success: true, bills: sortList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from HoaDon",
    });
    console.log(error);
    return [];
  }
};

module.exports = {
  getAllBills,
  addBill,
  updateBill,
  deleteBill,
  getBillsBySearch,
};
