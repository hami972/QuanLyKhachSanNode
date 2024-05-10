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
  query,
  where,
} = require("firebase/firestore");
const { firebase } = require("../config");
const firestore = getFirestore(firebase);

const addDocument = async (req, res) => {
  try {
    const myCollection = collection(firestore, req.params.dataName);
    const docRef = await addDoc(myCollection, req.body);
    console.log("Document successfully add!");
    res.send({
      success: false,
      message: "Document added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding document",
    });
  }
};
const compareDateTimes = (a, b) => {
  let r = new Date(b.ngay) - new Date(a.ngay);
  if (!r) {
    const [hourA, minuteA] = a.gio.split(":").map(Number);
    const [hourB, minuteB] = b.gio.split(":").map(Number);
    if (hourA !== hourB) return hourB - hourA;
    if (minuteA !== minuteB) return minuteB - minuteA;
  } else return r;
};
const compareDateTimes2 = (a, b) => {
  let r = new Date(b.NgayHen) - new Date(a.NgayHen);
  if (!r) {
    const [hourA, minuteA] = a.Gio.split(":").map(Number);
    const [hourB, minuteB] = b.Gio.split(":").map(Number);
    if (hourA !== hourB) return hourB - hourA;
    if (minuteA !== minuteB) return minuteB - minuteA;
  } else return r;
};
const getAllDocuments = async (req, res) => {
  const myCollection = collection(firestore, req.params.dataName);
  try {
    const { sortOrder } = req.query || null;
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const newList = sortOrder
      ? list.slice().sort((a, b) => {
          if (sortOrder === "asc") {
            return req.params.dataName == "LichHen"
              ? compareDateTimes2(b, a)
              : compareDateTimes(b, a);
          } else {
            return req.params.dataName == "LichHen"
              ? compareDateTimes2(a, b)
              : compareDateTimes(a, b);
          }
        })
      : list;

    res.json({ success: true, list: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from LichHen",
    });
    console.log(error);
    return [];
  }
};
const updateDocument = async (req, res) => {
  try {
    const myCollection = collection(firestore, req.params.dataName);
    const docRef1 = doc(myCollection, req.params.id);
    let data = req.body;
    await updateDoc(docRef1, data);
    console.log("Document successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error updating document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when update document",
    });
  }
};
const deleteDocument = async (req, res) => {
  try {
    const documentRef = doc(firestore, req.params.dataName, req.params.id);
    await deleteDoc(documentRef);
    console.log("Document deleted successfully.");
    res.send({ success: true, message: "Document successfully deleted!" });
  } catch (error) {
    console.log("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when delete document",
    });
  }
};
const getDocument = async (req, res) => {
  try {
    const myCollection = collection(firestore, req.params.dataName);
    const docRef1 = doc(myCollection, req.params.id);
    const documentSnapshot = await getDoc(docRef1);

    if (documentSnapshot.exists()) {
      res.send({ success: true, item: documentSnapshot.data() });
    } else {
      res.status(404).send({ success: false, message: "Doc not found" });
    }
  } catch (error) {
    console.error("Error get document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when get document",
    });
  }
};
const getDocumentByField = async (req, res) => {
  try {
    const myCollection = collection(firestore, req.params.dataName);

    const q = query(
      myCollection,
      where(req.params.fieldName, "==", req.query.fieldValue)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      //const firstDocument = querySnapshot.docs[0];
      res.send({
        success: true,
        list: querySnapshot.docs.map((doc) => ({ ...doc.data(), Id: doc.id })),
      });
    } else {
      res.status(404).send({ success: false, message: "Doc not found" });
    }
  } catch (error) {
    console.error("Error get document by field: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when get document",
    });
  }
};
async function generateSchedule(table, Month, Year) {
  const result = {};

  const daysInMonth = new Date(Year, Month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(Year, Month, day);
    const dayOfWeek = currentDate.getDay();
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    result[formattedDate] = [];

    const daySchedule = table[dayOfWeek];

    if (daySchedule.Sang) {
      for (let hour = 8; hour <= 11; hour++) {
        result[formattedDate].push({
          gio: `${hour}:00-${hour}:30`,
          maLichHen: null,
        });
        result[formattedDate].push({
          gio: `${hour}:30-${hour + 1}:00`,
          maLichHen: null,
        });
      }
    }

    if (daySchedule.Chieu) {
      for (let hour = 13; hour <= 16; hour++) {
        result[formattedDate].push({
          gio: `${hour}:00-${hour}:30`,
          maLichHen: null,
        });
        result[formattedDate].push({
          gio: `${hour}:30-${hour + 1}:00`,
          maLichHen: null,
        });
      }
    }

    if (daySchedule.Toi) {
      for (let hour = 17; hour <= 19; hour++) {
        result[formattedDate].push({
          gio: `${hour}:00-${hour}:30`,
          maLichHen: null,
        });
        result[formattedDate].push({
          gio: `${hour}:30-${hour + 1}:00`,
          maLichHen: null,
        });
      }
    }
  }

  return result;
}
const addDoctorSchedule = async (req, res) => {
  try {
    //add schedule for next month
    const currentDate = new Date();
    let Month = currentDate.getMonth();
    let Year = currentDate.getFullYear();
    Month += 1;
    if (Month > 11) {
      Month = 0;
      Year += 1;
    }

    const schedule = await generateSchedule(req.body.weekTable, Month, Year);
    const data = {
      maNS: req.body.doctorId,
      tenNS: req.body.doctorName,
      thang: Month + 1,
      nam: Year,
      lich: schedule,
      lichTuan: req.body.weekTable,
    };
    //console.log(data)
    const myCollection = collection(firestore, "LichBacSi");
    const docRef = await addDoc(myCollection, data);
    console.log("Document successfully add!");
    res.send({
      success: false,
      message: "Document added successfully",
      docId: docRef.id,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding document",
    });
  }
};

const updateDoctorSchedule = async (req, res) => {
  try {
    console.log("vào");
    //update schedule for next month
    const currentDate = new Date();
    let Month = currentDate.getMonth();
    let Year = currentDate.getFullYear();
    Month += 1;
    if (Month > 11) {
      Month = 0;
      Year += 1;
    }
    const schedule = await generateSchedule(req.body.weekTable, Month, Year);
    const data = {
      maNS: req.body.doctorId,
      tenNS: req.body.doctorName,
      thang: Month + 1,
      nam: Year,
      lich: schedule,
      lichTuan: req.body.weekTable,
    };
    const myCollection = collection(firestore, "LichBacSi");
    const docRef1 = doc(myCollection, req.params.id);
    await updateDoc(docRef1, data);
    console.log("Document successfully updated!");
    res.send({ success: true, message: "Document successfully updated!" });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({
      success: false,
      message: "something went wrong when adding document",
    });
  }
};

const getAppointmentsBySearch = async (req, res) => {
  const { MaNS, SDT, TenNS, TenBN, DichVu, NgayHen } = req.query;
  const myCollection = collection(firestore, "LichHen");
  try {
    const querySnapshot = await getDocs(myCollection);
    const list = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const docId = doc.id;
      return { ...data, Id: docId };
    });
    const searchResults = list.filter((lichHen) => {
      const normalizeText = (text) => text.toLowerCase();

      const matchMaNS =
        MaNS === "" ||
        normalizeText(lichHen.MaNS).includes(normalizeText(MaNS));
      const matchTenNS =
        TenNS === "" ||
        normalizeText(lichHen.TenNS).includes(normalizeText(TenNS));
      const matchSDT =
      SDT === "" ||
        normalizeText(lichHen.SDT).includes(normalizeText(SDT));
      const matchTenBN =
        TenBN === "" ||
        normalizeText(lichHen.TenBN).includes(normalizeText(TenBN));
      const matchDichVu =
        DichVu === "" ||
        normalizeText(lichHen.DichVu).includes(normalizeText(DichVu));
      const matchNgayHen = NgayHen === "" || lichHen.NgayHen == NgayHen;
      console.log(NgayHen);
      return (
        matchMaNS &&
        matchSDT &&
        matchTenBN &&
        matchTenNS &&
        matchDichVu &&
        matchNgayHen
      );
    });

    const newList = searchResults.slice().sort((a, b) => {
      return compareDateTimes2(b, a);
    });
    res.json({ success: true, list: newList });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong when get data from LichHen",
    });
    console.log(error);
    return [];
  }
};

module.exports = {
  addDocument,
  deleteDocument,
  updateDocument,
  getAllDocuments,
  getDocument,
  getDocumentByField,
  addDoctorSchedule,
  updateDoctorSchedule,
  getAppointmentsBySearch,
};
