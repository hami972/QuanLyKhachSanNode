const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const { firebase } = require('../config')
const firestore = getFirestore(firebase);

const addBlock = async (req, res) => {
    try {
        const myCollection = collection(firestore, 'Toa');
        const docRef = await addDoc(myCollection, req.body);
        console.log("Document csvc successfully add!");
        res.send({ success: false, message: 'CSVC added successfully', docId: docRef.id });
    } catch (error) {
        console.error("Error adding document CSVC: ", error);
        res.status(500).json({ success: false, message: 'something went wrong when adding CSVC' });
    }
};

const getAllBlocks = async (req, res) => {
    const myCollection = collection(firestore, 'Toa');
    try {
        const querySnapshot = await getDocs(myCollection);
        const list = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const docId = doc.id;
            return { ...data, Id: docId };
        });
        const newList = list.sort((a, b) => a.maToa.localeCompare(b.maToa));
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

const updateBlock = async (req, res) => {
    try {
        const myCollection = collection(firestore, 'Toa');
        const docRef1 = doc(myCollection, req.params.blockId);
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

const deleteBlock = async (req, res) => {
    try {
        const documentRef = doc(firestore, 'Toa', req.params.blockId);
        await deleteDoc(documentRef);
        console.log("Document branch deleted successfully.");
        res.send({ success: true, message: "Document successfully updated!" });
    } catch (error) {
        console.log("Error deleting branch document:", error);
        res.status(500).json({
            success: false,
            message: "something went wrong when delete document",
        });
    }
};

const getBlocksBySearch = async (req, res) => {
    const {
        maToa,
        tenToa,
        slPhongDau,
        slPhongCuoi,
        slTangDau,
        slTangCuoi,
        chiNhanh
    } = req.query;
    const myCollection = collection(firestore, 'Toa');
    try {
        const querySnapshot = await getDocs(myCollection);
        const list = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const docId = doc.id;
            return { ...data, Id: docId };
        });
        const searchResults = list.filter(toa => {
            const normalizeText = (text) => text.toLowerCase();
            const matchChiNhanh = normalizeText(toa.chiNhanh).includes(normalizeText(chiNhanh));
            const matchMaToa =
                maToa === "" ||
                normalizeText(toa.maToa).includes(normalizeText(maToa));
            const matchTenToa =
                tenToa === "" ||
                normalizeText(toa.tenToa).includes(normalizeText(tenToa));

            const matchSoLuongPhong =
                (slPhongDau == "" && slPhongCuoi == "") ||
                (slPhongDau != "" &&
                    parseFloat(toa.tang.reduce((total, tang) => total + (tang.dsPhong ? tang.dsPhong.split('-').length : 0), 0))
                    >= parseFloat(slPhongDau) &&
                    slPhongCuoi == "") ||
                (slPhongCuoi != "" &&
                    parseFloat(toa.tang.reduce((total, tang) => total + (tang.dsPhong ? tang.dsPhong.split('-').length : 0), 0))
                    <= parseFloat(slPhongCuoi) &&
                    slPhongDau == "") ||
                (slPhongDau != "" &&
                    slPhongCuoi != "" &&
                    parseFloat(toa.tang.reduce((total, tang) => total + (tang.dsPhong ? tang.dsPhong.split('-').length : 0), 0))
                    >= parseFloat(slPhongDau) &&
                    parseFloat(toa.tang.reduce((total, tang) => total + (tang.dsPhong ? tang.dsPhong.split('-').length : 0), 0))
                    <= parseFloat(slPhongCuoi));

            const matchSoLuongTang =
                (slTangDau == "" && slTangCuoi == "") ||
                (slTangDau != "" &&
                    parseFloat(toa.tang.length) >= parseFloat(slTangDau) &&
                    slTangCuoi == "") ||
                (slTangCuoi != "" &&
                    parseFloat(toa.tang.length) <= parseFloat(toa.tang.length) &&
                    slTangDau == "") ||
                (slTangDau != "" &&
                    slTangCuoi != "" &&
                    parseFloat(toa.tang.length) >= parseFloat(toa.tang.length) &&
                    parseFloat(toa.tang.length) <= parseFloat(toa.tang.length));

            return (
                matchMaToa &&
                matchTenToa &&
                matchSoLuongPhong &&
                matchSoLuongTang &&
                matchChiNhanh
            );
        });
        const sortList = searchResults.sort((a, b) =>
            a.maToa.localeCompare(b.maToa)
        );
        res.json({ success: true, list: sortList });
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

module.exports = { addBlock, getAllBlocks, updateBlock, deleteBlock, getBlocksBySearch }