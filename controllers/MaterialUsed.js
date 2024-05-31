const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase} = require('../config')
const firestore = getFirestore(firebase);

const addMaterialUsed = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'VatTuDaSuDung');
      const docRef = await addDoc(myCollection, req.body);
      console.log("Document vtdd successfully add!");
      res.send({ success: false, message: 'VTDD added successfully', docId: docRef.id });
    } catch (error) {
      console.error("Error adding document VTDD: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when adding VTDD'});
    }
};
const getMaterialsUsed = async (req, res) => {
    const myCollection = collection(firestore, 'VatTuDaSuDung');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    // const newList = list.sort((a, b) => a.maVatTu.localeCompare(b.maVatTu));
    list.sort(function(a, b) {
      if (a.NgaySuDung > b.NgaySuDung) {
          return -1; // Trả về số âm để đưa a lên trước b trong mảng
      } else if (a.NgaySuDung < b.NgaySuDung) {
          return 1; // Trả về số dương để đưa b lên trước a trong mảng
      } else {
          return 0; // Trả về 0 nếu a và b bằng nhau
      }
  });
    res.json({success:true, MU:list});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from VTDSD'})
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
      res.send({ success:true, message: 'Document successfully updated!' });
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
      res.send({ success:true, message: 'Document successfully updated!' });
    } catch (error) {
      console.log('Error deleting material document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
const getMaterialUsedBySearch = async (req, res) => {
  const { maVatTu, tenVatTu, NgaySuDung } = req.query;
  const myCollection = collection(firestore, 'VatTuDaSuDung');
    try{
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, Id: docId };
      });
    const searchResults = list.filter((vt) => {
      const normalizeText = (text) => text.toLowerCase();
    
      const matchMaVatTu = maVatTu === '' || normalizeText(vt.maVatTu).includes(normalizeText(maVatTu));
      const matchTenVatTu = tenVatTu === '' || normalizeText(vt.tenVatTu).includes(normalizeText(tenVatTu));
      const matchNgaySuDung = NgaySuDung === ''|| compareDates(vt.NgaySuDung, NgaySuDung) != -1
    
    
      return matchMaVatTu&& matchTenVatTu&&matchNgaySuDung;
    });
    const sortList = searchResults.sort((a, b) => a.maVatTu.localeCompare(b.maVatTu));
    res.json({success:true, VatTuDaSuDung:sortList});
    }
    catch(error){
        res.status(500).json({success:false, message: 'something went wrong when get data from VTDSD'})
        console.log(error);
        return [];
    }
}
module.exports={addMaterialUsed, getMaterialsUsed, updateMaterialUsed, deleteMaterialUsed, getMaterialUsedBySearch}