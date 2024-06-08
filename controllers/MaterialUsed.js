const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const { firebase } = require('../config')
const firestore = getFirestore(firebase);

const addMaterialUsed = async (req, res) => {
  try {
    const myCollection = collection(firestore, 'VatTuDaSuDung');
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document vtdd successfully add!");
    res.send({ success: false, message: 'VTDD added successfully', docId: docRef.id });
  } catch (error) {
    console.error("Error adding document VTDD: ", error);
    res.status(500).json({ success: false, message: 'something went wrong when adding VTDD' });
  }
};
const getMaterialsUsed = async (req, res) => {
  const myCollection = collection(firestore, 'VatTuDaSuDung');
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });

    const sortList = searchResults.sort((a, b) => a.ngayNhap.localeCompare(b.ngayNhap));
    res.json({ success: true, sortList: list });
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'something went wrong when get data from VTDSD' })
    console.log(error);
    return [];
  }
};
const updateMaterialUsed = async (req, res) => {
  try {
    const myCollection = collection(firestore, 'VatTuDaSuDung');
    const docRef1 = doc(myCollection, req.params.Id);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document materialused successfully updated!");
    res.send({ success: true, message: 'Document successfully updated!' });
  } catch (error) {
    console.error("Error updating materialused document: ", error);
    res.status(500).json({ success: false, message: 'something went wrong when update document' });
  }
};
const deleteMaterialUsed = async (req, res) => {
  try {
    const documentRef = doc(firestore, 'VatTuDaSuDung', req.params.Id);
    await deleteDoc(documentRef);
    console.log('Document materialUsed deleted successfully.');
    res.send({ success: true, message: 'Document successfully updated!' });
  } catch (error) {
    console.log('Error deleting material document:', error);
    res.status(500).json({ success: false, message: 'something went wrong when delete document' });
  }
};
const getMaterialUsedBySearch = async (req, res) => {
  const {
    maCSVC,
    tenCSVC,
    slnDau,
    slnCuoi,
    giaNhapDau,
    giaNhapCuoi,
    ngayDau,
    ngayCuoi,
    chiNhanh,
  } = req.query;
  const myCollection = collection(firestore, 'NhapKho');
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((csvc) => {

      const normalizeText = (text) => text.toLowerCase();
      const matchChiNhanh = normalizeText(csvc.chiNhanh).includes(normalizeText(chiNhanh));
      const matchMaCSVC =
        maCSVC === "" ||
        normalizeText(csvc.maCSVC).includes(normalizeText(maCSVC));
      const matchTenCSVC =
        tenCSVC === "" ||
        normalizeText(csvc.tenCSVC).includes(normalizeText(tenCSVC));

      const matchSoLuongNhap =
        (slnDau == "" && slnCuoi == "") ||
        (slnDau != "" &&
          parseFloat(csvc.slNhap) >= parseFloat(slnDau) &&
          slnCuoi == "") ||
        (slnCuoi != "" &&
          parseFloat(csvc.slNhap) <= parseFloat(slnCuoi) &&
          slnDau == "") ||
        (slnDau != "" &&
          slnCuoi != "" &&
          parseFloat(csvc.slNhap) >= parseFloat(slnDau) &&
          parseFloat(csvc.slNhap) <= parseFloat(slnCuoi));

      const matchGiaNhap =
        (giaNhapDau == "" && giaNhapCuoi == "") ||
        (giaNhapDau != "" &&
          parseFloat(csvc.giaNhap) >= parseFloat(giaNhapDau) &&
          giaNhaCuoi == "") ||
        (giaNhapCuoi != "" &&
          parseFloat(csvc.giaNhap) <= parseFloat(giaNhapCuoi) &&
          giaNhaDau == "") ||
        (giaNhapDau != "" &&
          giaNhapCuoi != "" &&
          parseFloat(csvc.giaNhap) >= parseFloat(giaNhapDau) &&
          parseFloat(csvc.giaNhap) <= parseFloat(giaNhapCuoi));
      const matchNgayNhap =
        (ngayDau == "" && ngayCuoi == "") ||
        (ngayDau != "" &&
          csvc.ngayNhap >= ngayDau &&
          ngayCuoi == "") ||
        (ngayCuoi != "" &&
          csvc.ngayNhap <= ngayCuoi &&
          ngayDau == "") ||
        (ngayDau != "" &&
          ngayCuoi != "" &&
          parseFloat(csvc.ngayNhap) >= parseFloat(ngayDau) &&
          parseFloat(csvc.ngayNhap) <= parseFloat(ngayCuoi));


      return matchChiNhanh && matchTenCSVC && matchMaCSVC
        && matchGiaNhap && matchNgayNhap && matchGiaNhap && matchSoLuongNhap;
    });
    const sortList = searchResults.sort((a, b) => a.maCSVC.localeCompare(b.maCSVC));
    res.json({ success: true, list: sortList });
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'something went wrong when get data from VTDSD' })
    console.log(error);
    return [];
  }
}
module.exports = { addMaterialUsed, getMaterialsUsed, updateMaterialUsed, deleteMaterialUsed, getMaterialUsedBySearch }