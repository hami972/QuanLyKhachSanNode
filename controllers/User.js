const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc,getDoc, deleteDoc} = require('firebase/firestore');
const {firebase, admin} = require('../config')
const firestore = getFirestore(firebase);
const nodemailer = require('nodemailer');
const setUserInfo = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'TaiKhoan');
      const docRef1 = doc(myCollection, req.params.userId);
      await setDoc(docRef1, req.body);
      console.log("Document successfully set!");
      res.send({ message: 'User data set successfully' });
    } catch (error) {
      console.error("Error setting user document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when set user data'});
    }
  };
  const addUser = async(req,res)=>{
    const myCollection = collection(firestore, 'TaiKhoan');
    try{
      const data = req.body;
      await addDoc(myCollection, data)
      .then((docRef) => {
        const d = doc(myCollection, docRef.id);
        updateDoc(d, {Id:docRef.id});
        console.log('save success')
        res.send({ message: 'Data saved successfully' });
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
    }
    catch(error){
      console.error("Error addcomment: ", error);
    }
  }
  const SignIn = async (req,res) => {
    const myCollection = collection(firestore, 'TaiKhoan');
    try{
    const querySnapshot = await getDocs(myCollection);
    let flag = false;
    let userInfo = {};
    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if(data.SigninName == req.params.name && data.password==req.params.pass)
      {
        flag = true;
        userInfo = data
      }
    });
    res.json({success:true, userInfo:userInfo, flag:flag});
    }
    catch(error){
        console.log(error);
    }
  };
  const checkUserName = async(req,res)=>{
    const myCollection = collection(firestore, 'TaiKhoan');
    try{
    const querySnapshot = await getDocs(myCollection);
    let flag = false;
    querySnapshot.docs.map((doc) => {
      const data = doc.data();
      if(data.SigninName == req.params.name)
      {
        flag = true;
      }
    });
    res.json({success:true,flag:flag});
    }
    catch(error){
        console.log(error);
    }
  }

  // Tạo một transporter sử dụng máy chủ SMTP của bạn
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Địa chỉ máy chủ SMTP của bạn
    port: 465, // Cổng SMTP (ví dụ: 465 cho SSL, 587 cho TLS)
    secure: true, // true nếu sử dụng SSL, false nếu sử dụng TLS
    auth: {
      user: 'ngothibaolinhnm2003@gmail.com', // Email của bạn
      pass: 'ihtfmeaaasyxiidr', // Mật khẩu của bạn
    },
  });
  
  // Hàm gửi email
  const sendEmail = async (req,res) => {
    try {
      const data = req.body;
      await transporter.sendMail({
        from: '21522332@gm.uit.edu.com',
        to:'21522332@gm.uit.edu.com',
        subject:'Ứng dụng Quản lý khách sạn gửi lại mật khẩu',
        text:'111111',
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  const updateUser = async (req, res) => {
    try {
      const myCollection = collection(firestore, 'TaiKhoan');
      const docRef1 = doc(myCollection, req.params.userId);
      let data = req.body
      await updateDoc(docRef1, data);
      console.log("Document successfully updated!");
      res.send({ message: 'Document successfully updated!' });
    } catch (error) {
      console.error("Error updating user document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when update user data' });
    }
  };
  const getUserData = async (req, res) => {
    try {
  
      const myCollection = collection(firestore, 'TaiKhoan');
      const docRef1 = doc(myCollection, req.params.userId);
      const documentSnapshot = await getDoc(docRef1);
  
      if (documentSnapshot.exists()) {
        res.send({ success: true, userData: documentSnapshot.data() });
      } else {
        res.status(404).send({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error("Error get user document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong when get data from users' });
    }
  };
  const findStaffbymaNV = async (req, res)=>{
    try{
      const myCollection = collection(firestore, 'TaiKhoan');
      const querySnapshot = await getDocs(myCollection);
      let id = ''
       querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if(data.maNV == req.params.maNV)
          {
            id = doc.id
          }
        });
        res.json({success:true,idTK:id});

    } catch (error){
      console.error("Error get user document: ", error);
      res.status(500).json({ success: false, message: 'something went wrong ' });
    }
  }
  const deleteUser = async (req, res) => {
    try {
      const documentRef = doc(firestore, 'TaiKhoan', req.params.Id);
      await deleteDoc(documentRef);
      console.log('Document deleted successfully.');
      admin.auth().deleteUser(req.params.Id).then(() => {
        console.log('Successfully deleted user account authentication');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
      res.send({ success:true, message: 'Document successfully delete!' });
    } catch (error) {
      console.log('Error deleting staff document:', error);
      res.status(500).json({ success: false, message: 'something went wrong when delete document' });
    }
};
  module.exports={setUserInfo, addUser, SignIn, sendEmail, checkUserName, updateUser, getUserData, findStaffbymaNV, deleteUser}