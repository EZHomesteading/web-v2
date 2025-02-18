const defaultProducts = [
  {
    title: "Beefsteak Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTBuFIao2XnTxSiDvbZjpG1WC3HahOwdsIgcqM",
  },
  {
    title: "Red Delicious Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTFcXXcKhjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Strawberries",
    subCategory: "fruit",
    photo: "/images/product-images/strawberry.webp",
  },
  {
    title: "Chicken Eggs",
    subCategory: "egg",
    photo: "/images/product-images/egg.webp",
  },
  {
    title: "Duck Eggs",
    subCategory: "egg",
    photo: "/images/product-images/egg.webp",
  },
  {
    title: "Turkey Eggs",
    subCategory: "egg",
    photo: "/images/product-images/egg.webp",
  },
  {
    title: "Basil",
    subCategory: "herbs",
    photo: "/images/product-images/basil.webp",
  },
  {
    title: "Blood Oranges",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTp6Y2x8d9SINi678cjxKFPUGvJAL5BMuoD2rd",
  },
  {
    title: "Baby Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/baby-spinach.webp",
  },
  {
    title: "Elk",
    subCategory: "",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTmLMrm5Zs13dmAu2Er0O4NahJMWDoKB98jVXL",
  },
  {
    title: "Cherry Tomatoes",
    subCategory: "fruit vegetables",
    photo: "/images/product-images/cherry-tomato.webp",
  },
  {
    title: "Heirloom Tomatoes",
    subCategory: "fruit vegetables",
    photo: "/images/product-images/hierloom-tomato.webp",
  },
  {
    title: "Roma Tomatoes",
    subCategory: "fruit vegetables",
    photo: "/images/product-images/roma-tomato.webp",
  },
  {
    title: "Grape Tomatoes",
    subCategory: "fruit vegetables",
    photo: "/images/product-images/grape-tomato.webp",
  },
  {
    title: "San Marzano Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Brandywine Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Green Zebra Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Cherokee Purple Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Yellow Pear Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Black Krim Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Amish Paste Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Celebrity Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Early Girl Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Big Boy Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Sun Gold Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Sweet Million Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Mortgage Lifter Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Pineapple Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Supersweet 100 Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Black Cherry Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Campari Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Kumato Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Principe Borghese Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Rutgers Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Paul Robeson Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Arkansas Traveler Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Persimmon Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Costoluto Genovese Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Striped German Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Golden Jubilee Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Green Giant Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Orange Wellington Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Pink Brandywine Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Red Currant Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Snow White Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Yellow Brandywine Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Black Pineapple Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Blondkopfchen Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Caspian Pink Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "German Johnson Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Hillbilly Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Indigo Rose Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Japanese Black Trifele Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Kellogg's Breakfast Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Marianna's Peace Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Old German Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Purple Calabash Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Rose de Berne Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Tigerella Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Valencia Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
  {
    title: "Granny Smith Apples",
    subCategory: "fruit",
    photo: "/images/product-images/granny-smith.webp",
  },
  {
    title: "Fuji Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTorm9C3AeD5vwIsRJETMAdHgtQXkKU6YVfWF2",
  },
  {
    title: "Gala Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTUnreGcNWlVtTh5EJkzqLpCZjBbxe6aHN7FIU",
  },
  {
    title: "Honeycrisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTB8QDlC2XnTxSiDvbZjpG1WC3HahOwdsIgcqM",
  },
  {
    title: "Golden Delicious Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTXyvDwf1ZlPTBCc8o5R7HaKbJ1e60qySmgdsn",
  },
  {
    title: "Pink Lady Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "McIntosh Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Braeburn Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Jonagold Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Cortland Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Empire Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Arkansas Black Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Rome Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Ambrosia Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Jazz Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Cameo Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Opal Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Winesap Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Mutsu Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "York Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Pink Pearl Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Liberty Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Ginger Gold Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Paula Red Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Northern Spy Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Gravenstein Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Jonathan Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "SunCrisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Crimson Crisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "EverCrisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "SnowSweet Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Snowdrift Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "SweeTango Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Wine Crisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Ruby Frost Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Autumn Glory Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Cosmic Crisp Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Smitten Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Kiku Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Envy Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Snapdragon Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Pacific Rose Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Kanzi Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Ambri Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "SweeTango Tango Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "SweeTango Zester Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Sweetie Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Sweetie Pie Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Sweetie Treat Apples",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTheOEz3U1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Anjou Pears",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTz0IxdZjBqQlo0PsXn2YM3pZtFTxu6WzhVHEr",
  },
  {
    title: "Bartlett Pears",
    subCategory: "fruit",
    photo: "/images/product-images/bartlett-pear.webp",
  },
  {
    title: "Bosc Pears",
    subCategory: "fruit",
    photo: "/images/product-images/bosc-pear.webp",
  },
  {
    title: "Comice Pears",
    subCategory: "fruit",
    photo: "/images/product-images/comice-pear.webp",
  },
  {
    title: "Forelle Pears",
    subCategory: "fruit",
    photo: "/images/product-images/forelle-pear.webp",
  },
  {
    title: "Seckel Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Concorde Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Starkrimson Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Asian Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Forelle Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Red Anjou Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Green Anjou Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Concorde Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Starkrimson Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Comice Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Red Bartlett Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Brown Bartlett Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Green Bartlett Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Red Sensation Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Hosui Asian Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Shinseiki Asian Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "20th Century Asian Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Ya Li Asian Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Harrow Sweet Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Magness Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Moonglow Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Blake's Pride Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Harrow Delight Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Summercrisp Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Harrow Crisp Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Orcas Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Rescue Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Moonglow Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "D'Anjou Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Red D'Anjou Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Green D'Anjou Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Max Red Bartlett Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Maxie Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Pineapple Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Warren Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Warren Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Ayers Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Le Conte Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Kieffer Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Blake's Pride Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Luscious Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Orca Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Olympic Pears",
    subCategory: "fruit",
    photo: "/images/product-images/pear.webp",
  },
  {
    title: "Navel Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/navel-orange.webp",
  },
  {
    title: "Valencia Oranges",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTw2l2lsYz6ixTYWHnrfbqAUeFEo0ayIwJS7Cd",
  },
  {
    title: "Cara Cara Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Seville Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/mandarin-orange.webp",
  },
  {
    title: "Satsuma Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Clementine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Moro Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Ambersweet Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Temple Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Sour Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Clementine Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Dancy Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Nova Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Sunburst Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Fairchild Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Robinson Tangerine Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Orlando Tangelo Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Minneola Tangelo Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Ugli Fruits",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Tangor Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Lemonade Lemon Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Sour Lemon Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Tangelo Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Seminole Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Pineapple Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Bitter Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Trifoliate Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Cleopatra Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Kumquat Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Willowleaf Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Kinnow Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Sunki Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Ponkan Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Dekopon Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Yuzu Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Khasi Mandarin Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Clementine Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Satsuma Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Tangor Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Tangelo Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Clementine Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Nova Tangelo Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Ortanique Hybrid Oranges",
    subCategory: "fruit",
    photo: "/images/product-images/orange.webp",
  },
  {
    title: "Nantes Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/nantes-carrot.webp",
  },
  {
    title: "Danvers Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/danvers-carrot.webp",
  },
  {
    title: "Imperator Carrots",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTUpc8Q0NWlVtTh5EJkzqLpCZjBbxe6aHN7FIU",
  },
  {
    title: "Chantenay Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Paris Market Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Babette Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Little Finger Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Scarlet Nantes Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Kuroda Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Atomic Red Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Cosmic Purple Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Solar Yellow Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Lunar White Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Bolero Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Thumbelina Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Dragon Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Purple Haze Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Atomic Red Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Cosmic Purple Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Solar Yellow Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Lunar White Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Bolero Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Thumbelina Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Dragon Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Purple Haze Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Yellowstone Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Red Samurai Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Sweet Treat Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Sugarsnax Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Kaleidoscope Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Purple Elite Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Merida Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Sugarsnax Hybrid Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Babette Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Kinko Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Purple 68 Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/purple-68-carrot.webp",
  },
  {
    title: "Amsterdam Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Sweetness III Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/sweetness-III-carrot.webp",
  },
  {
    title: "Sugarsnax Hybrid Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Hercules Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Kaleidoscope Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Purple Elite Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Merida Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Babette Carrots",
    subCategory: "vegetables",
    photo: "/images/product-images/carrot.webp",
  },
  {
    title: "Bloomsdale Spinach",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTG8COCGSY4pcS7n6ZNtE1X3rdPWCKBGV0DFvR",
  },
  {
    title: "Savoy Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Malabar Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/malabar-spinach.webp",
  },
  {
    title: "Red Kitten Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Tyee Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Space Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Giant Winter Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Matador Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Corvair Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Regiment Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Space Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Reflect Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Avenger Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Coronet Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Catalyst Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Giant Nobel Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Red Cardinal Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Vienna Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Nobel Giant Spinach",
    subCategory: "herbs",
    photo: "/images/product-images/spinach.webp",
  },
  {
    title: "Calabrese Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTIEyukvWcSemfvbr2tjniyBOkxdMhpA3TNCZV",
  },
  {
    title: "Sprouting Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Romanesco Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Purple Sprouting Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Broccolini",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Broccoflower",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Baby Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Purple Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "White Sprouting Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Belstar Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Green Magic Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Imperial Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Paragon Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Arcadia Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Green Goliath Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Marathon Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Packman Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Belstar Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Green Magic Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Imperial Broccoli",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9sAWLrFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Concord Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/concord-grape.webp",
  },
  {
    title: "Thompson Seedless Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/thompson-seedless-grape.webp",
  },
  {
    title: "Green Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/thompson-seedless-grape.webp",
  },
  {
    title: "Red Globe Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/red-globe-grape.webp",
  },
  {
    title: "Red Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/red-globe-grape.webp",
  },
  {
    title: "Crimson Seedless Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Chardonnay Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Cabernet Sauvignon Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Pinot Noir Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Muscat Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Merlot Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Zinfandel Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Cabernet Franc Grapes",
    subCategory: "fruit",
    photo: "/images/product-images/crimson-seedless-grape.webp",
  },
  {
    title: "Eureka Lemons",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Lisbon Lemons",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Meyer Lemons",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Ponderosa Lemons",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Lunario Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Variegated Pink Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Yen Ben Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Femminello St. Teresa Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Verna Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Bush Lemon",
    subCategory: "fruit",
    photo: "/images/product-images/lemon.webp",
  },
  {
    title: "Armenian Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT1i3jjUKmbfnTYMO4djAx0tFRsD3HVCZSPzkJ",
  },
  {
    title: "English Telegraph Cucumbers",
    subCategory: "vegetables",
    photo: "/images/product-images/english-telegraph-cucumber.webp",
  },
  {
    title: "Persian Cucumbers",
    subCategory: "vegetables",
    photo: "/images/product-images/persian-cucumber.webp",
  },
  {
    title: "Lemon Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Japanese Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Kirby Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Marketmore Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "National Pickling Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Straight Eight Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Bush Crop Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Parisian Pickling Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Burpless Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "DivA Hybrid Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Marketmore 76 Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Sweet Success Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Sumter Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Sweet Slice Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Tasty Green Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Picklebush Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Miniature White Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Mexican Sour Gherkin Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Passandra Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Dasher II Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Fanfare Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Cucino Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Greensleeves Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Socrates Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Regal Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Patio Snacker Cucumbers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTTVZP8PTakhdpB7DiweAVGP4N9qnvjMZ8LgFO",
  },
  {
    title: "Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Smooth Cayenne Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Red Spanish Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Sugarloaf Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Hilo Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Pernambuco Pineapple",
    subCategory: "fruit",
    photo: "/images/product-images/pineapple.webp",
  },
  {
    title: "Detroit Dark Red Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Golden Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Chioggia Beet (Candy Stripe Beet)",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Bulls Blood Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Cylindra Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Burpee's Golden Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Early Wonder Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Merlin Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Ruby Queen Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Touchstone Gold Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Avalanche Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Badger Flame Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Blankoma Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Crosby Egyptian Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Early Wonder Tall Top Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Formanova Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Lutz Green Leaf Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Red Ace Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Red Cloud Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "White Albino Beets",
    subCategory: "vegetables",
    photo: "/images/product-images/beet.webp",
  },
  {
    title: "Hass Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Fuerte Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Reed Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Bacon Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Zutano Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Gwen Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Pinkerton Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Lamb Hass Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Sharwil Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Brogdon Avacados",
    subCategory: "fruit",
    photo: "/images/product-images/avocado.webp",
  },
  {
    title: "Blueberries",
    subCategory: "fruit",
    photo: "UE11RVNWlVtTuSS4j7h3aelANkQ0YFV1t7cfXOTDZBEPhodK",
  },
  {
    title: "Raspberries",
    subCategory: "fruit",
    photo: "/images/product-images/raspberry.webp",
  },
  {
    title: "Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/blackberry.webp",
  },
  {
    title: "Cranberries",
    subCategory: "fruit",
    photo: "/images/product-images/cranberry.webp",
  },
  {
    title: "Goji Berries",
    subCategory: "fruit",
    photo: "/images/product-images/goji-berry.webp",
  },
  {
    title: "Acai Berries",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTDtxwuzpAV7xKFpgtvkOU3rEBhW8Q4TcDlPfa",
  },
  {
    title: "Elderberries",
    subCategory: "fruit",
    photo: "/images/product-images/elderberry.webp",
  },
  {
    title: "Mulberries",
    subCategory: "fruit",
    photo: "/images/product-images/mulberry.webp",
  },
  {
    title: "Huckleberries",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTtsdBJZOYaK5ATsRnvJUOeVu4WoE72yNw1thS",
  },
  {
    title: "Salmonberries",
    subCategory: "fruit",
    photo: "/images/product-images/salmonberry.webp",
  },
  {
    title: "Marionberries",
    subCategory: "fruit",
    photo: "/images/product-images/blackberry.webp",
  },
  {
    title: "Currant Berries",
    subCategory: "fruit",
    photo: "/images/product-images/currant-berry.webp",
  },
  {
    title: "White Mulberries",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTh0urqMU1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Beautyberries",
    subCategory: "fruit",
    photo: "/images/product-images/beautyb.webp",
  },
  {
    title: "Bearberries",
    subCategory: "fruit",
    photo: "/images/product-images/buffb.webp",
  },
  {
    title: "Snowberries",
    subCategory: "fruit",
    photo: "/images/product-images/snowb.webp",
  },
  {
    title: "Calafate Berries",
    subCategory: "fruit",
    photo: "/images/product-images/calafate.webp",
  },
  {
    title: "Chehalem Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Clingstone Thornless Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Cutleaf Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Garden Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Himalayan Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Natchez Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Triple Crown Blackberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Waldo Berries",
    subCategory: "fruit",
    photo: "/images/product-images/aronian.webp",
  },
  {
    title: "Hardy Kiwis",
    subCategory: "fruit",
    photo: "/images/product-images/hkiwi.webp",
  },
  {
    title: "Olallieberries",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTp5mJWd9SINi678cjxKFPUGvJAL5BMuoD2rdV",
  },
  {
    title: "Thimbleberries",
    subCategory: "fruit",
    photo: "/images/product-images/thimbleberry.webp",
  },
  {
    title: "Bananaberries",
    subCategory: "fruit",
    photo: "/images/product-images/aronian.webp",
  },
  {
    title: "Cape Gooseberries",
    subCategory: "fruit",
    photo: "/images/product-images/capegoose.webp",
  },
  {
    title: "Barberries",
    subCategory: "fruit",
    photo: "/images/product-images/barberry.webp",
  },
  {
    title: "Buffaloberries",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTU1g4IY5NWlVtTh5EJkzqLpCZjBbxe6aHN7FI",
  },
  {
    title: "Salal Berries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Seaberries",
    subCategory: "fruit",
    photo: "/images/product-images/seaber.webp",
  },
  {
    title: "Strawberry Tree Berries",
    subCategory: "fruit",
    photo: "/images/product-images/strawtree.webp",
  },
  {
    title: "Youngberries",
    subCategory: "fruit",
    photo: "/images/product-images/youngber.webp",
  },
  {
    title: "Partridgeberries",
    subCategory: "fruit",
    photo: "/images/product-images/partridgeb.webp",
  },
  {
    title: "Debbaneh Berrieies",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Tropical Berries",
    subCategory: "fruit",
    photo: "/images/product-images/tropicber.webp",
  },
  {
    title: "Raisinberries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Chokeberries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Boysenberries",
    subCategory: "fruit",
    photo: "/images/product-images/Boysenberry.webp",
  },
  {
    title: "Saskatoon Berries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Juneberries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Serviceberries",
    subCategory: "fruit",
    photo: "/images/product-images/serviceb.webp",
  },
  {
    title: "Cloud Berries",
    subCategory: "fruit",
    photo: "/images/product-images/cloudberries.webp",
  },
  {
    title: "Aronia Berries",
    subCategory: "fruit",
    photo: "/images/product-images/aronia.webp",
  },
  {
    title: "Cilantro",
    subCategory: "herbs",
    photo: "/images/product-images/cilantro.webp",
  },
  {
    title: "Parsley",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTvPZY3gszcFGt4Z3WOCIKHXEJaBQgsDhefm2lhttps://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTvPZY3gszcFGt4Z3WOCIKHXEJaBQgsDhefm2l",
  },
  {
    title: "Mint",
    subCategory: "herbs",
    photo: "/images/product-images/mint.webp",
  },
  {
    title: "Thyme",
    subCategory: "herbs",
    photo: "/images/product-images/thyme.webp",
  },
  {
    title: "Oregano",
    subCategory: "herbs",
    photo: "/images/product-images/oregano.webp",
  },
  {
    title: "Rosemary",
    subCategory: "herbs",
    photo: "/images/product-images/rosemary.webp",
  },
  {
    title: "Sage",
    subCategory: "herbs",
    photo: "/images/product-images/sage.webp",
  },
  {
    title: "Chives",
    subCategory: "herbs",
    photo: "/images/product-images/chives.webp",
  },
  {
    title: "Dill",
    subCategory: "herbs",
    photo: "/images/product-images/dill.webp",
  },
  {
    title: "Borage",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTJzp92Om4zV16Mi5jwaFU0AsnGmEHPBIZbkQC",
  },
  {
    title: "Culantro",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTJzdGe6X4zV16Mi5jwaFU0AsnGmEHPBIZbkQC",
  },
  {
    title: "Lemongrass",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT9MgwOpFD6XqN0xo5scPCmdMAEuIvBQpJ2iSO",
  },
  {
    title: "Lavender",
    subCategory: "herbs",
    photo: "/images/product-images/lavender.webp",
  },
  {
    title: "Fennel",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTAo4IJL9o9eCtsOPrlIRcVM4hqvE0KLkYjGBw",
  },
  {
    title: "Tarragon",
    subCategory: "herbs",
    photo: "/images/product-images/tarragon.webp",
  },
  {
    title: "Marjoram",
    subCategory: "herbs",
    photo: "/images/product-images/marjoram.webp",
  },
  {
    title: "Cress",
    subCategory: "herbs",
    photo: "/images/product-images/cress.webp",
  },
  {
    title: "Savory",
    subCategory: "herbs",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTkJTY4uixXmSMD2shFNwi1WaIZqAJjvpc9yOt",
  },
  {
    title: "Bay Leaf",
    subCategory: "herbs",
    photo: "/images/product-images/bayleaf.webp",
  },
  {
    title: "Watermelon",
    subCategory: "fruit",
    photo: "/images/product-images/watermel.webp",
  },
  {
    title: "Cantaloupe",
    subCategory: "fruit",
    photo: "/images/product-images/cantaloupe.webp",
  },
  {
    title: "Honeydew Melon",
    subCategory: "fruit",
    photo: "/images/product-images/honeydew.webp",
  },
  {
    title: "Casaba Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Crenshaw Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Canary Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Persian Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Galia Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Piel de Sapo Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Golden Dewlicious Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Winter Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Hamigua Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Bitter Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Preserve Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Kiwano Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Santa Claus Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Sprite Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Galia Melon",
    subCategory: "fruit",
    photo: "/images/product-images/spritemel.webp",
  },
  {
    title: "Dragon Fruits",
    subCategory: "fruit",
    photo: "/images/product-images/dragonFruits.webp",
  },
  {
    title: "Kiwano",
    subCategory: "fruit",
    photo: "/images/product-images/kiwano.webp",
  },
  {
    title: "Star Fruits",
    subCategory: "fruit",
    photo: "/images/product-images/star.webp",
  },
  {
    title: "Durian",
    subCategory: "fruit",
    photo: "/images/product-images/durian.webp",
  },
  {
    title: "JackFruits",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTy9IOyXHk57cnToxHl2QPYZAmCLw4gBez3tdV",
  },
  {
    title: "Rambutan",
    subCategory: "fruit",
    photo: "/images/product-images/rambutan.webp",
  },
  {
    title: "Mangosteen",
    subCategory: "fruit",
    photo: "/images/product-images/mangosteen.webp",
  },
  {
    title: "Passion Fruits",
    subCategory: "fruit",
    photo: "/images/product-images/passion.webp",
  },
  {
    title: "Papaya",
    subCategory: "fruit",
    photo: "/images/product-images/papaya.webp",
  },
  {
    title: "Guava",
    subCategory: "fruit",
    photo: "/images/product-images/guava.webp",
  },
  {
    title: "Lychee",
    subCategory: "fruit",
    photo: "/images/product-images/lychee.webp",
  },
  {
    title: "Açaí",
    subCategory: "fruit",
    photo: "/images/product-images/acai.webp",
  },
  {
    title: "Pitaya, Dragon Fruits",
    subCategory: "fruit",
    photo: "/images/product-images/dragonFruits.webp",
  },
  {
    title: "Feijoa",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTHqdnQnonEDz41CSAg6Xdm8kqZuljwx9ypRMI",
  },
  {
    title: "Chayote",
    subCategory: "fruit",
    photo: "/images/product-images/chayote.webp",
  },
  {
    title: "Yuca",
    subCategory: "vegetables",
    photo: "/images/product-images/yuca.webp",
  },
  {
    title: "Jícama",
    subCategory: "vegetables",
    photo: "/images/product-images/jicama.webp",
  },
  {
    title: "Salsify",
    subCategory: "vegetables",
    photo: "/images/product-images/salsify.webp",
  },
  {
    title: "Parsnip",
    subCategory: "vegetables",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Bok Choy",
    subCategory: "vegetables",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Bean Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Alfalfa Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Mung Bean Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Broccoli Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Radish Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Pea Shoots",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Sunflower Shoots",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Wheatgrass",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Arugula Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Clover Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Lentil Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Fenugreek Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Kale Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Chia Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Bamboo Shoots",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Soybean Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Cabbage Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Mustard Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Celery Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Onion Sprouts",
    subCategory: "herbs",
    photo: "/images/product-images/sprouts.webp",
  },
  {
    title: "Potato",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTz2PraijBqQlo0PsXn2YM3pZtFTxu6WzhVHEr",
  },
  {
    title: "Sweet Potato",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT28XURDtbOReTLEhXHSVqnsADZa4c0BiGIF3J",
  },
  {
    title: "Yam",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT28XURDtbOReTLEhXHSVqnsADZa4c0BiGIF3J",
  },
  {
    title: "Cassava",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Taro",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Jicama",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Jerusalem Artichoke",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Rutabaga",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Sunchokes",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Chinese Artichoke",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Arracacha",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Oca",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Crosne",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Chayote",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Malanga",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Konjac",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Tiquisque",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Dasheen",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Plectranthus",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Chufa",
    subCategory: "vegetables",
    photo: "/images/product-images/tubers.webp",
  },
  {
    title: "Garlic",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/39dcdbfa-e9b8-4c0b-9a34-ea3cb87bdb5c-kq1umq.webp",
  },
  {
    title: "Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Leek",
    subCategory: "vegetables",
    photo: "/images/product-images/leek.webp",
  },
  {
    title: "Scallion",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT3OdfSuGAckdxoXtm3gyfUjGsuRIOp2DC47wY",
  },
  {
    title: "Chives",
    subCategory: "vegetables",
    photo: "/images/product-images/chives.webp",
  },
  {
    title: "Shallot",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Spring Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Elephant Garlic",
    subCategory: "vegetables",
    photo: "/images/product-images/garlic.webp",
  },
  {
    title: "Pearl Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Ramps",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Welsh Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Egyptian Walking Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Tree Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Evergreen Bunching Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Cipollini Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Red Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Yellow Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "White Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Vidalia Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Boiling Onion",
    subCategory: "vegetables",
    photo: "/images/product-images/onion.webp",
  },
  {
    title: "Green Pea",
    subCategory: "vegetables",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Snow Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Sugar Snap Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Black-Eyed Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Yellow Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Split Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Chickpea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Black Chickpea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Green Chickpea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Pigeon Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Field Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Crowder Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Purple Hull Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Cowpea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Garden Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Edible-Podded Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Alderman Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Tom Thumb Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Butter Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Snap Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Green Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Kidney Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Black Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Pinto Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Navy Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Lima Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Garbanzo Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Fava Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Cannellini Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Great Northern Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Black-Eyed Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Adzuki Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Red Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Cranberry Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Mung Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Lentil",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Chickpea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Black-Eyed Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Split Pea",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Lima Bean",
    subCategory: "vegetables legumes",
    photo: "/images/product-images/beans.webp",
  },
  {
    title: "Butternut Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Acorn Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Spaghetti Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Yellow Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Delicata Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Kabocha Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Hubbard Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Buttercup Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Carnival Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Pattypan Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Crookneck Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Straightneck Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Sweet Dumpling Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Golden Nugget Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Hubbard Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Tromboncino Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Tatume Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Calabaza Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Banana Squash",
    subCategory: "fruit",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTYlFAOYkTHxwClNOdV63419mY8u5BqGXfJhbz",
  },
  {
    title: "Dill Pickles",
    subCategory: "vegetables",
    photo: "/images/product-images/pickle.webp",
  },
  {
    title: "Sweet Pickles",
    subCategory: "vegetables",
    photo: "/images/product-images/pickle.webp",
  },
  {
    title: "Bread and Butter Pickles",
    subCategory: "vegetables",
    photo: "/images/product-images/pickle.webp",
  },
  {
    title: "Bell Peppers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTzZ7QcMjBqQlo0PsXn2YM3pZtFTxu6WzhVHEr",
  },
  {
    title: "Jalapeno Peppers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTv4qFwrzcFGt4Z3WOCIKHXEJaBQgsDhefm2lT",
  },
  {
    title: "Habanero Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/habanero.webp",
  },
  {
    title: "Cayenne Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/thaichili.webp",
  },
  {
    title: "Anaheim Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Poblano Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pablo.webp",
  },
  {
    title: "Fresno Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/fresno.webp",
  },
  {
    title: "Chipotle Peppers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTwqvUlzYz6ixTYWHnrfbqAUeFEo0ayIwJS7Cd",
  },
  {
    title: "Serrano Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/Serranos.webp",
  },
  {
    title: "Banana Peppers",
    subCategory: "vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTm6l3aVZs13dmAu2Er0O4NahJMWDoKB98jVXL",
  },
  {
    title: "Thai Chili Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/thaichili.webp",
  },
  {
    title: "Bird's Eye Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Cubanelle Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Carolina Reaper Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/carolina.webp",
  },
  {
    title: "Ghost Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/Ghost-pepper.webp",
  },
  {
    title: "Scotch Bonnet Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Aji Amarillo Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Peperoncini Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/peperon.webp",
  },
  {
    title: "Shishito Peppers",
    subCategory: "vegetables",
    photo: "/images/product-images/pepper.webp",
  },
  {
    title: "Iceberg Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/iceberg.webp",
  },
  {
    title: "Romaine Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/Romaine.webp",
  },
  {
    title: "Butterhead Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Leaf Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Red Leaf Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Green Leaf Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Boston Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Summer Crisp Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Batavia Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Arugula Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/Arugula.webp",
  },
  {
    title: "Frisee Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Oak Leaf Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Crisphead Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Endive Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Escarole Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Radichetta Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Tango Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Lollo Rosso Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Red Batavia Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Salanova Lettuce",
    subCategory: "vegetables",
    photo: "/images/product-images/lettuce.webp",
  },
  {
    title: "Beef",
    subCategory: "beef",
    photo: "/images/product-images/beef.webp",
  },
  {
    title: "Pork",
    subCategory: "pork",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT0qdHGhyd3fVz95JLWZ40IgvQrYGHkiCEDXSp",
  },
  {
    title: "Chicken",
    subCategory: "poultry",
    photo: "/images/product-images/chicken.webp",
  },
  {
    title: "Turkey",
    subCategory: "poultry",
    photo: "/images/product-images/turkey.webp",
  },
  {
    title: "Lamb",
    subCategory: "alternative-meats",
    photo: "/images/product-images/lamb.webp",
  },
  {
    title: "Duck",
    subCategory: "alternative-meats",
    photo: "/images/product-images/duck.webp",
  },
  {
    title: "Bison",
    subCategory: "alternative-meats",
    photo: "/images/product-images/bison.webp",
  },
  {
    title: "Rabbit",
    subCategory: "alternative-meats",
    photo: "/images/product-images/rabbit.webp",
  },
  {
    title: "Quail",
    subCategory: "alternative-meats",
    photo: "/images/product-images/quail.webp",
  },
  {
    title: "Venison",
    subCategory: "alternative-meats",
    photo: "/images/product-images/venison.webp",
  },
  {
    title: "Goose",
    subCategory: "alternative-meats",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTyeEiv0Hk57cnToxHl2QPYZAmCLw4gBez3tdV",
  },
  {
    title: "Pheasant",
    subCategory: "alternative-meats",
    photo: "/images/product-images/Pheasant.webp",
  },
  {
    title: "Wild Boar",
    subCategory: "alternative-meats",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTMFpLjFBzuDFPk76EciKO0NjqyY8U3S9V4vwd",
  },
  {
    title: "Emu",
    subCategory: "alternative-meats",
    photo: "/images/product-images/emu.webp",
  },
  {
    title: "Ostrich",
    subCategory: "alternative-meats",
    photo: "/images/product-images/ostrich.webp",
  },
  {
    title: "Alligator",
    subCategory: "alternative-meats",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT1gt9ujCKmbfnTYMO4djAx0tFRsD3HVCZSPzk",
  },
  {
    title: "Frog",
    subCategory: "alternative-meats",
    photo: "/images/product-images/frogleg.webp",
  },
  {
    title: "Milk",
    subCategory: "milks",
    photo: "/images/product-images/milk.webp",
  },
  {
    title: "Whole Milk",
    subCategory: "milks",
    photo: "/images/product-images/milk.webp",
  },
  {
    title: "2% Milk",
    subCategory: "milks",
    photo: "/images/product-images/milk.webp",
  },
  {
    title: "Heavy Whipping Cream",
    subCategory: "milks",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTh9WcliU1kYUR5jdlaSIEqsJ9hZMbCFW3uprV",
  },
  {
    title: "Cheese",
    subCategory: "dairy-products",
    photo: "/images/product-images/cheese.webp",
  },
  {
    title: "Yogurt",
    subCategory: "dairy-product",
    photo: "/images/product-images/yogurt.webp",
  },
  {
    title: "Butter",
    subCategory: "dairy-products",
    photo: "/images/product-images/butter.webp",
  },
  {
    title: "Cream",
    subCategory: "milks",
    photo: "/images/product-images/cream.webp",
  },
  {
    title: "Ice Cream",
    subCategory: "dairy-products",
    photo: "/images/product-images/icecream.webp",
  },
  {
    title: "Almonds",
    subCategory: "nuts",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtT1gPcU1KmbfnTYMO4djAx0tFRsD3HVCZSPzkJ",
  },
  {
    title: "Walnuts",
    subCategory: "nuts",
    photo: "/images/product-images/walnut.webp",
  },
  {
    title: "Cashews",
    subCategory: "nuts",
    photo: "/images/product-images/cashew.webp",
  },
  {
    title: "Pistachios",
    subCategory: "nuts",
    photo: "/images/product-images/pistachio.webp",
  },
  {
    title: "Hazelnuts",
    subCategory: "nuts",
    photo: "/images/product-images/hazel.webp",
  },
  {
    title: "Peanuts",
    subCategory: "nuts",
    photo: "/images/product-images/peanuts.webp",
  },
  {
    title: "Baguette",
    subCategory: "breads",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTd1BYJbI4us0JNPxzTCW7QIVoFcHwGBL3Une2",
  },
  {
    title: "Sourdough",
    subCategory: "breads",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTwx4ZTuLYz6ixTYWHnrfbqAUeFEo0ayIwJS7C",
  },
  {
    title: "Whole Wheat",
    subCategory: "breads",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTp6T7iGd9SINi678cjxKFPUGvJAL5BMuoD2rd",
  },
  {
    title: "Rye Bread",
    subCategory: "breads",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTmQUoIyZs13dmAu2Er0O4NahJMWDoKB98jVXL",
  },
  {
    title: "Ciabatta",
    subCategory: "breads",
    photo: "/images/product-images/ciabatta.webp",
  },
  {
    title: "Multigrain",
    subCategory: "breads",
    photo: "/images/product-images/multigrain.webp",
  },
  {
    title: "Olive Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Coconut Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Canola Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Sesame Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Sunflower Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Avocado Oil",
    subCategory: "oils",
    photo: "/images/product-images/oil.webp",
  },
  {
    title: "Rice",
    subCategory: "grains",
    photo: "/images/product-images/rice.webp",
  },
  {
    title: "Quinoa",
    subCategory: "grains",
    photo: "/images/product-images/millet.webp",
  },
  {
    title: "Oats",
    subCategory: "grains",
    photo: "/images/product-images/oats.webp",
  },
  {
    title: "Barley",
    subCategory: "grains",
    photo: "/images/product-images/barley.webp",
  },
  {
    title: "Bulgur",
    subCategory: "grains",
    photo: "/images/product-images/millet.webp",
  },
  {
    title: "Millet",
    subCategory: "grains",
    photo: "/images/product-images/millet.webp",
  },
  {
    title: "Cocao seeds",
    subCategory: "fruit",
    photo: "/images/product-images/chocolate.webp",
  },
  {
    title: "Cocao pods",
    subCategory: "fruit",
    photo: "/images/product-images/chocolate.webp",
  },
  {
    title: "Chocolate",
    subCategory: "candy",
    photo: "/images/product-images/chocolate.webp",
  },
  {
    title: "Cookies",
    subCategory: "baked-goods",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTJf9Hfw4zV16Mi5jwaFU0AsnGmEHPBIZbkQCl",
  },
  {
    title: "Cake",
    subCategory: "pastries",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTzYzEAvjBqQlo0PsXn2YM3pZtFTxu6WzhVHEr",
  },
  {
    title: "Hybrid Tomatoes",
    subCategory: "fruit vegetables",
    photo:
      "https://ruhn2hhuu8.ufs.sh/f/UE11RVNWlVtTF1GXgohjNDAYBg3P92aF48UbH5zqyx0dtsXW",
  },
];

const getlistings = async () => {
  try {
    if (typeof window !== "undefined") {
      const response = await fetch(`/api/listing/listingSuggestionsCreate`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedListings = data.listings.map((product: any) => ({
        title: product.title,
        subCategory: product.subCategory,
        photo: "",
      }));
      return [...defaultProducts, ...formattedListings];
    } else {
      return [...defaultProducts];
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    return defaultProducts; // Return default products in case of error
  }
};

export const getProducts = getlistings();
