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

const addMaterial = async (req, res) => {
  try {
    const myCollection = collection(firestore, "VatTu");
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document material successfully add!");
    res.send({
      success: false,
      message: "Material added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document material: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when adding material",
      });
  }
};
const getAllMaterials = async (req, res) => {
  const myCollection = collection(firestore, "VatTu");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = list.sort((a, b) => a.maVatTu.localeCompare(b.maVatTu));
    res.json({ success: true, materials: newList });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when get data from VatTu",
      });
    console.log(error);
    return [];
  }
};
const updateMaterial = async (req, res) => {
  try {
    const myCollection = collection(firestore, "VatTu");
    const docRef1 = doc(myCollection, req.params.materialId);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document material successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error updating material document: ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when update document",
      });
  }
};
const deleteMaterial = async (req, res) => {
  try {
    const documentRef = doc(firestore, "VatTu", req.params.materialId);
    await deleteDoc(documentRef);
    console.log("Document material deleted successfully.");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.log("Error deleting material document:", error);
    res
      .status(500)
      .json({
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
    return 0;
  }
}

const getMaterialsBySearch = async (req, res) => {
  const {
    maVatTu,
    tenVatTu,
    slnDau,
    slnCuoi,
    sltkDau,
    sltkCuoi,
    giaDau,
    giaCuoi,
    ngayDau,
    ngayCuoi,
    chiNhanh
  } = req.query;
  const myCollection = collection(firestore, "VatTu");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((vatTu) => {
      const normalizeText = (text) => text.toLowerCase();
      const matchChiNhanh = chiNhanh===""||chiNhanh==="Tất cả"|| normalizeText(vatTu.chiNhanh).includes(normalizeText(chiNhanh));
      const matchMaVatTu =
        maVatTu === "" ||
        normalizeText(vatTu.maVatTu).includes(normalizeText(maVatTu));
      const matchTenVatTu =
        tenVatTu === "" ||
        normalizeText(vatTu.tenVatTu).includes(normalizeText(tenVatTu));

      const matchGiaNhap =
        (giaDau == "" && giaCuoi == "") ||
        (giaDau != "" &&
          parseFloat(vatTu.donGiaNhap) >= parseFloat(giaDau) &&
          giaCuoi == "") ||
        (giaCuoi != "" &&
          parseFloat(vatTu.donGiaNhap) <= parseFloat(giaCuoi) &&
          giaDau == "") ||
        (giaDau != "" &&
          giaCuoi != "" &&
          parseFloat(vatTu.donGiaNhap) >= parseFloat(giaDau) &&
          parseFloat(vatTu.donGiaNhap) <= parseFloat(giaCuoi));

      const matchSoLuongNhap =
        (slnDau == "" && slnCuoi == "") ||
        (slnDau != "" &&
          parseFloat(vatTu.soLuongNhap) >= parseFloat(slnDau) &&
          slnCuoi == "") ||
        (slnCuoi != "" &&
          parseFloat(vatTu.soLuongNhap) <= parseFloat(slnCuoi) &&
          slnDau == "") ||
        (slnDau != "" &&
          slnCuoi != "" &&
          parseFloat(vatTu.soLuongNhap) >= parseFloat(slnDau) &&
          parseFloat(vatTu.soLuongNhap) <= parseFloat(slnCuoi));

      const matchSoLuongTonKho =
        (sltkDau == "" && sltkCuoi == "") ||
        (sltkDau != "" &&
          parseFloat(vatTu.soLuongTonKho) >= parseFloat(sltkDau) &&
          sltkCuoi == "") ||
        (sltkCuoi != "" &&
          parseFloat(vatTu.soLuongTonKho) <= parseFloat(sltkCuoi) &&
          sltkDau == "") ||
        (sltkDau != "" &&
          sltkCuoi != "" &&
          parseFloat(vatTu.soLuongTonKho) >= parseFloat(sltkDau) &&
          parseFloat(vatTu.soLuongTonKho) <= parseFloat(sltkCuoi));

      const matchNgayNhap =
        (ngayDau == "" && ngayCuoi == "") ||
        (ngayDau != "" &&
          compareDates(vatTu.ngayNhap, ngayDau) != -1 &&
          ngayCuoi == "") ||
        (ngayCuoi != "" &&
          compareDates(vatTu.ngayNhap, ngayCuoi) != 1 &&
          ngayDau == "") ||
        (ngayDau != "" &&
          ngayCuoi != "" &&
          compareDates(vatTu.ngayNhap, ngayDau) != -1 &&
          compareDates(vatTu.ngayNhap, ngayCuoi) != 1);

      return (
        matchMaVatTu &&
        matchTenVatTu &&
        matchGiaNhap &&
        matchSoLuongNhap &&
        matchSoLuongTonKho &&
        matchNgayNhap &&
        matchChiNhanh
      );
    });
    const sortList = searchResults.sort((a, b) =>
      a.maVatTu.localeCompare(b.maVatTu)
    );
    res.json({ success: true, materials: sortList });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "something went wrong when get data from VatTu",
      });
    console.log(error);
    return [];
  }
};

module.exports = {
  addMaterial,
  getAllMaterials,
  updateMaterial,
  deleteMaterial,
  getMaterialsBySearch,

};
