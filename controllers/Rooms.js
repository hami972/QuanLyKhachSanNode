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

const getKindOfRoomBySearch = async (req, res) => {
  const {
    maLoaiPhong,
    tenLoaiPhong,
    donGiaDau,
    donGiaCuoi,
    slnMaxDau,
    slnMaxCuoi,
    chiNhanh } = req.query;
  const myCollection = collection(firestore, "LoaiPhong");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((phong) => {
      const normalizeText = (text) => text.toLowerCase();
      console.log("abc");
      const matchChiNhanh = chiNhanh === "" || chiNhanh === "Tất cả" || normalizeText(phong.chiNhanh).includes(normalizeText(chiNhanh));
      const matchmaLoaiPhong =
        maLoaiPhong === "" ||
        normalizeText(phong.maLoaiPhong).includes(normalizeText(maLoaiPhong));
      const matchtenLoaiPhong =
        tenLoaiPhong === "" ||
        normalizeText(phong.tenLoaiPhong).includes(normalizeText(tenLoaiPhong));
      const matchsoLuongNguoiToiDa =
        (slnMaxDau == "" && slnMaxCuoi == "") ||
        (slnMaxDau != "" &&
          parseFloat(phong.soLuongNguoiToiDa) >= parseFloat(slnMaxDau) &&
          slnMaxCuoi == "") ||
        (slnMaxCuoi != "" &&
          parseFloat(phong.soLuongNguoiToiDa) <= parseFloat(slnMaxCuoi) &&
          slnMaxDau == "") ||
        (slnMaxDau != "" &&
          slnMaxCuoi != "" &&
          parseFloat(phong.soLuongNguoiToiDa) >= parseFloat(slnMaxDau) &&
          parseFloat(phong.soLuongNguoiToiDa) <= parseFloat(slnMaxCuoi));
      const matchDonGia =
        (donGiaDau == "" && donGiaCuoi == "") ||
        (donGiaDau != "" &&
          parseFloat(phong.donGia) >= parseFloat(donGiaDau) &&
          donGiaCuoi == "") ||
        (donGiaCuoi != "" &&
          parseFloat(phong.donGia) <= parseFloat(donGiaCuoi) &&
          donGiaDau == "") ||
        (slnMaxDau != "" &&
          donGiaCuoi != "" &&
          parseFloat(phong.donGia) >= parseFloat(donGiaDau) &&
          parseFloat(pphong.donGia) <= parseFloat(donGiaCuoi));
      return (
        matchmaLoaiPhong &&
        matchtenLoaiPhong &&
        matchsoLuongNguoiToiDa &&
        matchDonGia &&
        matchChiNhanh
      );
    });
    const sortList = searchResults.sort((a, b) =>
      a.maLoaiPhong.localeCompare(b.maLoaiPhong)
    );
    res.json({ success: true, kindOfRoom: sortList });
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
  getAllKindOfRoom,
  addKindOfRoom,
  updateKindOfRoom,
  deleteKindOfRoom,
  getKindOfRoomBySearch
};
