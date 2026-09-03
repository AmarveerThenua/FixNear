const stateCities = {
  "Andhra Pradesh": [
    "Amaravati",
    "Anantapur",
    "Chittoor",
    "Eluru",
    "Guntur",
    "Kadapa",
    "Kakinada",
    "Kurnool",
    "Nellore",
    "Rajahmundry",
    "Tirupati",
    "Vijayawada",
    "Visakhapatnam",
    "Vizianagaram",
  ],

  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Pasighat",
    "Tawang",
    "Ziro",
  ],

  Assam: [
    "Dibrugarh",
    "Dispur",
    "Guwahati",
    "Jorhat",
    "Nagaon",
    "Silchar",
    "Tezpur",
  ],

  Bihar: [
    "Arrah",
    "Begusarai",
    "Bhagalpur",
    "Bihar Sharif",
    "Darbhanga",
    "Gaya",
    "Muzaffarpur",
    "Patna",
    "Purnia",
  ],

  Chhattisgarh: [
    "Ambikapur",
    "Bhilai",
    "Bilaspur",
    "Durg",
    "Korba",
    "Raipur",
    "Rajnandgaon",
  ],

  Goa: [
    "Mapusa",
    "Margao",
    "Panaji",
    "Ponda",
    "Vasco da Gama",
  ],

  Gujarat: [
    "Ahmedabad",
    "Anand",
    "Bhavnagar",
    "Gandhinagar",
    "Jamnagar",
    "Junagadh",
    "Rajkot",
    "Surat",
    "Vadodara",
    "Vapi",
  ],

  Haryana: [
    "Ambala",
    "Faridabad",
    "Gurugram",
    "Hisar",
    "Karnal",
    "Panipat",
    "Rohtak",
    "Sonipat",
    "Yamunanagar",
  ],

  "Himachal Pradesh": [
    "Baddi",
    "Chamba",
    "Dharamshala",
    "Kullu",
    "Mandi",
    "Shimla",
    "Solan",
  ],

  Jharkhand: [
    "Bokaro",
    "Deoghar",
    "Dhanbad",
    "Hazaribagh",
    "Jamshedpur",
    "Ranchi",
  ],

  Karnataka: [
    "Ballari",
    "Belagavi",
    "Bengaluru",
    "Davangere",
    "Hubballi",
    "Kalaburagi",
    "Mangaluru",
    "Mysuru",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
  ],

  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Kannur",
    "Kochi",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Palakkad",
    "Thiruvananthapuram",
    "Thrissur",
  ],

  "Madhya Pradesh": [
    "Bhopal",
    "Burhanpur",
    "Dewas",
    "Gwalior",
    "Indore",
    "Jabalpur",
    "Katni",
    "Khandwa",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Ujjain",
    "Vidisha",
  ],

  Maharashtra: [
    "Ahmednagar",
    "Amravati",
    "Aurangabad",
    "Bhiwandi",
    "Chandrapur",
    "Jalgaon",
    "Kolhapur",
    "Mumbai",
    "Nagpur",
    "Nashik",
    "Navi Mumbai",
    "Pune",
    "Solapur",
    "Thane",
    "Vasai-Virar",
  ],

  Manipur: [
    "Imphal",
    "Bishnupur",
    "Churachandpur",
    "Thoubal",
  ],

  Meghalaya: [
    "Jowai",
    "Nongpoh",
    "Shillong",
    "Tura",
  ],

  Mizoram: [
    "Aizawl",
    "Champhai",
    "Kolasib",
    "Lunglei",
  ],

  Nagaland: [
    "Dimapur",
    "Kohima",
    "Mokokchung",
    "Tuensang",
  ],

  Odisha: [
    "Balasore",
    "Bargarh",
    "Berhampur",
    "Bhubaneswar",
    "Cuttack",
    "Jharsuguda",
    "Puri",
    "Rourkela",
    "Sambalpur",
  ],

  Punjab: [
    "Amritsar",
    "Bathinda",
    "Chandigarh",
    "Jalandhar",
    "Ludhiana",
    "Mohali",
    "Patiala",
    "Pathankot",
  ],

  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Bharatpur",
    "Bikaner",
    "Bhilwara",
    "Jaipur",
    "Jaisalmer",
    "Jodhpur",
    "Kota",
    "Sikar",
    "Sri Ganganagar",
    "Udaipur",
  ],

  Sikkim: [
    "Gangtok",
    "Gyalshing",
    "Namchi",
    "Pelling",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Erode",
    "Hosur",
    "Madurai",
    "Salem",
    "Thanjavur",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tiruppur",
    "Vellore",
  ],

  Telangana: [
    "Hyderabad",
    "Karimnagar",
    "Khammam",
    "Nizamabad",
    "Ramagundam",
    "Warangal",
  ],

  Tripura: [
    "Agartala",
    "Dharmanagar",
    "Kailashahar",
    "Udaipur",
  ],

  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ayodhya",
    "Azamgarh",
    "Bareilly",
    "Firozabad",
    "Ghaziabad",
    "Gorakhpur",
    "Jhansi",
    "Kanpur",
    "Lucknow",
    "Mathura",
    "Meerut",
    "Moradabad",
    "Muzaffarnagar",
    "Noida",
    "Prayagraj",
    "Rampur",
    "Saharanpur",
    "Shahjahanpur",
    "Sitapur",
    "Varanasi",
  ],

  Uttarakhand: [
    "Almora",
    "Dehradun",
    "Haridwar",
    "Haldwani",
    "Kashipur",
    "Nainital",
    "Rishikesh",
    "Roorkee",
  ],

  "West Bengal": [
    "Asansol",
    "Bardhaman",
    "Durgapur",
    "Howrah",
    "Kharagpur",
    "Kolkata",
    "Siliguri",
  ],

  "Andaman and Nicobar Islands": [
    "Port Blair",
  ],

  Chandigarh: [
    "Chandigarh",
  ],

  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
  ],

  Delhi: [
    "Delhi",
    "New Delhi",
  ],

  "Jammu and Kashmir": [
    "Anantnag",
    "Baramulla",
    "Jammu",
    "Kathua",
    "Srinagar",
    "Udhampur",
  ],

  Ladakh: [
    "Kargil",
    "Leh",
  ],

  Lakshadweep: [
    "Agatti",
    "Amini",
    "Kavaratti",
  ],

  Puducherry: [
    "Karaikal",
    "Mahe",
    "Puducherry",
    "Yanam",
  ],
};

export const indianStates = Object.keys(stateCities);

export default stateCities;