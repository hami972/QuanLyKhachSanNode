const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const { firebase } = require('../config')
const firestore = getFirestore(firebase);

const addDamagedMaterial = async (req, res) => {
    try {
        const myCollection = collection(firestore, 'CSVCHu');
        const docRef = await addDoc(myCollection, req.body);
        console.log("Document csvc successfully add!");
        res.send({ success: false, message: 'CSVC added successfully', docId: docRef.id });
    } catch (error) {
        console.error("Error adding document CSVC: ", error);
        res.status(500).json({ success: false, message: 'something went wrong when adding CSVC' });
    }
};

const getDamagedMaterial = async (req, res) => {
    const myCollection = collection(firestore, 'CSVCHu');
    try {
        const querySnapshot = await getDocs(myCollection);
        const list = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const docId = doc.id;
            return { ...data, Id: docId };
        });
        const newList = list.sort((a, b) => a.ngayGhiNhan.localeCompare(b.ngayGhiNhan));
        res.json({ success: true, materials: newList });
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "something went wrong when get data from csvc",
            });
        console.log(error);
        return [];
    }
};

const getDamagedMaterialBySearch = async (req, res) => {
    const {
        maCSVC,
        tenCSVC,
        slnDau,
        slnCuoi,
        ngayDau,
        ngayCuoi,
        chiNhanh,
    } = req.query;
    const myCollection = collection(firestore, 'CSVCHu');
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
                && matchNgayNhap && matchSoLuongNhap;
        });
        const sortList = searchResults.sort((a, b) => b.ngayGhiNhan.localeCompare(a.ngayGhiNhan));
        res.json({ success: true, list: sortList });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'something went wrong when get data from VTDSD' })
        console.log(error);
        return [];
    }
}
const updateDamagedMaterial = async (req, res) => {
    try {
        const myCollection = collection(firestore, 'CSVCHu');
        const docRef1 = doc(myCollection, req.params.Id);
        let data = req.body;
        await updateDoc(docRef1, data);
        console.log("Document branch successfully updated!");
        res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
        console.error("Error updating branch document: ", error);
        res.status(500).json({
            success: false,
            message: "something went wrong when update document",
        });
    }
};

const deleteDamagedMaterial = async (req, res) => {
    try {
        const documentRef = doc(firestore, 'CSVCHu', req.params.Id);
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

module.exports = { addDamagedMaterial, getDamagedMaterial, getDamagedMaterialBySearch, deleteDamagedMaterial, updateDamagedMaterial }