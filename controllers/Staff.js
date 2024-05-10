const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase} = require('../config')
const firestore = getFirestore(firebase);

const addStaff = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'NhanVien');
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document staff successfully add!");
      res.send({ success: false, message: 'Staff added successfully', docId: docRef.id });
    } catch (error) {
      console.error("Error adding document staff: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding staff'});
    }
};
const getAllStaffs = async (req, res) => {
    const myCollection = collection(firestore, 'NhanVien');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const newList = list.sort((a, b) => a.maNhanVien.localeCompare(b.maNhanVien));
    res.json({success:true, staffs:newList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from NhanVien'})
        console.log(error);
        return [];
    }
};
const updateStaff = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'NhanVien');
      const docRef1 = doc(myCollection, req.params.staffId);
      let data = req.body;
      await updateDoc(docRef1, data);
      console.log("Document staff successfully updated!");
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating staff document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update document' });
    }
};
const deleteStaff = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'NhanVien', req.params.staffId);
      await deleteDoc(documentRef);
      console.log('Document staff deleted successfully.');
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting staff document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
const getStaffsBySearch = async (req, res) => {
  const { maNhanVien, tenNhanVien, chucVu, chiNhanh, luongDau, luongCuoi } = req.query;
  const myCollection = collection(firestore, 'NhanVien');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((nhanVien) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaNhanVien = maNhanVien === '' || normalizeText(nhanVien.maNhanVien).includes(normalizeText(maNhanVien));
      const matchTenNhanVien = tenNhanVien === '' || normalizeText(nhanVien.tenNhanVien).includes(normalizeText(tenNhanVien));
      
      const matchChucVu = chucVu == 'Tất cả' || chucVu == nhanVien.chucVu;
      const matchChiNhanh = chiNhanh == 'Tất cả' || chiNhanh == nhanVien.chiNhanh;
      const matchLuong =
      (luongDau == '' && luongCuoi == '') ||
      (luongDau != '' && parseFloat(nhanVien.luongCoBan) >= parseFloat(luongDau) && luongCuoi == '') ||
      (luongCuoi != '' && parseFloat(nhanVien.luongCoBan) <= parseFloat(luongCuoi) && luongDau == '')||
      (luongDau != '' && luongCuoi != '' &&
        parseFloat(nhanVien.luongCoBan) >= parseFloat(luongDau) &&
        parseFloat(nhanVien.luongCoBan) <= parseFloat(luongCuoi));
    
      return matchMaNhanVien && matchTenNhanVien && matchChucVu && matchChiNhanh && matchLuong;
    });
    const sortList = searchResults.sort((a, b) => a.maNhanVien.localeCompare(b.maNhanVien));
    res.json({success:true, staffs:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from NhanVien'})
        console.log(error);
        return [];
    }
}
module.exports={addStaff, getAllStaffs, updateStaff, deleteStaff, getStaffsBySearch}