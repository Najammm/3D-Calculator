import React, { useState, useEffect } from "react";
import "./index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Wrench,
  CheckCircle,
  Camera,
  FileText,
  PieChart,
} from "lucide-react";

const ROICalculator = () => {
  // State for current slide
  const [currentSlide, setCurrentSlide] = useState(1);

  // State for customer information (Slide 1)
  const [customerInfo, setCustomerInfo] = useState({
    companyName: "",
    contactName: "",
    zipCode: "",
    email: "",
    phone: "",
  });

  // State for traditional info (Slide 2)
  const [traditionalInfo, setTraditionalInfo] = useState({
    surveyorCount: 2,
    hourlyRate: 65,
    fieldMeasurementHours: 24,
    deliverablesHours: 40,
    monthlyProjects: 8,
    reworkPercentage: 15,
  });

  // State for 3D Scanning info (Slide 2)
  const [scanningInfo, setScanningInfo] = useState({
    scannerModel: "X9 Core",
    operatorCount: 1,
    scanTimeHours: 8,
    processingHours: 2,
    deliverablesHours: 4,
    initialInvestment: 60000,
  });

  // State for ROI calculations (Slide 3)
  const [roiData, setRoiData] = useState({
    traditionalCosts: [],
    scanningCosts: [],
    productivityIncrease: 0,
    roi: 0,
    breakeven: 0,
    fiveYearROI: 0,
    timeSavings: 0,
    traditionalMonthlyCost: 0,
    scanningMonthlyCost: 0,
    reworkSavings: 0,
    reworkPercentage: 15,
    reworkCostSavings: 0,
  });

  // State for benefit analysis (Slide 4)
  const [benefitData, setBenefitData] = useState({
    errorReduction: {
      traditional: 5,
      scanning: 1,
    },
    documentationQuality: {
      traditional: 3,
      scanning: 9,
    },
    reductionRanges: {
      min: 40,
      max: 80,
    },
    selectedReduction: 60,
    annualReworkHours: 0,
    annualReworkCost: 0,
    hoursSaved: 0,
    costSaved: 0,
    dataArchivalValue: 0,
    changeMgmtSavings: 0,
    fabricationSavings: 0,
    concreteFloorAnalysisSavings: 0,
    // Initialize all checkboxes to true by default
    enabledBenefits: {
      reworkReduction: true,
      dataArchival: true,
      changeManagement: true,
      fabrication: true,
      concreteFloor: true,
    },
  });

  // Scanner model configurations and their costs
  const modelConfigurations = {
    "X9 Core": 60000,
    "X9 Premium": 72000,
  };

  // Update investment cost when model changes
  useEffect(() => {
    const cost = modelConfigurations[scanningInfo.scannerModel];
    setScanningInfo((prev) => ({ ...prev, initialInvestment: cost }));
  }, [scanningInfo.scannerModel]);

  // Update scan time based on field measurement time and deliverables hours
  useEffect(() => {
    const scanTime = traditionalInfo.fieldMeasurementHours / 3;
    const processingTime = scanTime * 0.25;
    const deliverableTime = traditionalInfo.deliverablesHours * 0.1;

    setScanningInfo((prev) => ({
      ...prev,
      scanTimeHours: scanTime,
      processingHours: processingTime,
      deliverablesHours: deliverableTime,
    }));
  }, [
    traditionalInfo.fieldMeasurementHours,
    traditionalInfo.deliverablesHours,
  ]);

  // Calculate ROI data when traditional or 3D scanning info changes
  useEffect(() => {
    if (currentSlide === 3) {
      calculateROI();
    }
  }, [currentSlide, traditionalInfo, scanningInfo]);

  // Calculate benefit analysis when needed or when enabled benefits change
  useEffect(() => {
    if (currentSlide === 4) {
      calculateBenefitAnalysis();
    }
  }, [
    currentSlide,
    roiData,
    benefitData.selectedReduction,
    benefitData.enabledBenefits,
  ]);

  // Handle customer info changes
  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle traditional info changes
  const handleTraditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setTraditionalInfo((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Handle 3D scanning info changes
  const handleScanningInfoChange = (e) => {
    const { name, value } = e.target;
    setScanningInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle benefit reduction percentage change
  const handleReductionChange = (e) => {
    const value = parseInt(e.target.value);
    setBenefitData((prev) => ({ ...prev, selectedReduction: value }));
  };

  // Handle benefit toggle (checkbox) changes
  const handleBenefitToggle = (benefitName) => {
    setBenefitData((prev) => ({
      ...prev,
      enabledBenefits: {
        ...prev.enabledBenefits,
        [benefitName]: !prev.enabledBenefits[benefitName],
      },
    }));
  };

  // Function to send data to CRM API (placeholder)
  const sendDataToCRM = () => {
    const data = calculateROI(); // Calculate ROI first to ensure we have the values

    // Create a structured object for ROI Data
    const roiDataObject = {
      CUSTOMER_INFORMATION: {
        Company_Name: customerInfo.companyName,
        Contact_Name: customerInfo.contactName,
        Zip_Code: customerInfo.zipCode,
        Email: customerInfo.email,
        Phone: customerInfo.phone || "Not provided",
      },
      TRADITIONAL_SETUP: {
        Monthly_Projects: traditionalInfo.monthlyProjects,
        Number_of_Personnel: traditionalInfo.surveyorCount,
        Hourly_Rate: `$${traditionalInfo.hourlyRate}`,
        Field_Measurement_Hours: `$${traditionalInfo.fieldMeasurementHours}`,
        Deliverables_Hours: traditionalInfo.deliverablesHours,
        Typical_Rework_Percentage: `$${traditionalInfo.reworkPercentage}`,
      },
      Scanning_Method: {
        Scanner_Model: scanningInfo.scannerModel,
        Deliverables_Time: scanningInfo.deliverablesHours,
        Number_of_Operators: `$${scanningInfo.operatorCount}`,
        Scanning_Time: scanningInfo.scanTimeHours,
        Processing_Time: scanningInfo.processingHours,
      },
      ROI_CALCULATOR: {
        Time_Efficiency_Gain: `${data.timeEfficiencyGain.toFixed(1)}%`,
        Annual_ROI: `${data.roi.toFixed(1)}%`,
        Five_Year_ROI: `${data.fiveYearROI.toFixed(1)}%`,
        Monthly_Time_Savings: `${data.timeSavings.toFixed(1)} hours`,
        Breakeven_Point: data.breakeven
          ? `${data.breakeven.toFixed(1)} months`
          : "N/A",
      },
      Generated_On: new Date().toLocaleString(),
    };

    // console.log(roiDataObject);

    // Convert the object to a properly formatted JSON string
    const roiDataText = JSON.stringify(roiDataObject);

    // Encode the JSON string for URL inclusion
    const encodedRoiData = encodeURIComponent(roiDataText);

    // Construct the full URL with the roidata parameter
    const apiUrl = `https://www.zohoapis.com/crm/v7/functions/rts_roi_v2026/actions/execute?auth_type=apikey&zapikey=1003.fbdcd3c87c9b3217f06707a5bdf03400.058c11de15744d85b481b76aa7b2f8bf&roidata=${encodedRoiData}`;

    console.log("Sending data to Zoho API");
    // console.log("API URL:", apiUrl);

    // Create an image object to trigger the URL (this is a way to make a request without waiting for response)
    const img = new Image();
    img.src = apiUrl;

    // Move to the next slide immediately
    setCurrentSlide(3);
  };

  // Navigate to next slide
  const nextSlide = () => {
    if (currentSlide < 4) {
      // If we're on slide 2 and about to go to slide 3, send data to CRM
      if (currentSlide === 2) {
        sendDataToCRM();
        return; // sendDataToCRM handles the navigation
      }

      setCurrentSlide(currentSlide + 1);

      if (currentSlide === 2) {
        calculateROI();
      }
      if (currentSlide === 3) {
        calculateBenefitAnalysis();
      }
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Calculate ROI data
  const calculateROI = () => {
    // Traditional costs
    const traditionalTotalHours =
      traditionalInfo.fieldMeasurementHours + traditionalInfo.deliverablesHours;
    const traditionalPerProjectCost =
      traditionalTotalHours *
      traditionalInfo.hourlyRate *
      traditionalInfo.numberOfPersonnel;
    const traditionalMonthlyCost =
      traditionalPerProjectCost * traditionalInfo.monthlyProjects; // Monthly cost

    // 3D Scanning costs
    const scanningTotalHours =
      scanningInfo.scanTimeHours +
      scanningInfo.processingHours +
      scanningInfo.deliverablesHours;
    const scanningPerProjectCost =
      scanningTotalHours *
      traditionalInfo.hourlyRate *
      scanningInfo.operatorCount;
    const scanningMonthlyCost =
      scanningPerProjectCost * traditionalInfo.monthlyProjects; // Monthly cost
    const scanningMonthlyTotalCost =
      scanningMonthlyCost + scanningInfo.initialInvestment / 36; // Including amortized equipment cost (3 years)

    // Calculate productivity increase (reduction in time)
    const timeEfficiencyGain =
      ((traditionalTotalHours - scanningTotalHours) / traditionalTotalHours) *
      100;

    // Generate 36 months of cost data with cumulative values (3 years)
    const traditionalCosts = [];
    const scanningCosts = [];

    for (let i = 1; i <= 36; i++) {
      const tCost = traditionalMonthlyCost * i;
      const tbCost = scanningMonthlyCost * i + scanningInfo.initialInvestment;

      traditionalCosts.push({
        month: `Month ${i}`,
        cost: tCost,
      });

      scanningCosts.push({
        month: `Month ${i}`,
        cost: tbCost,
      });
    }

    // Calculate the breakeven point (when traditional cumulative cost exceeds scanning cumulative cost)
    let breakeven = null;
    for (let i = 0; i < traditionalCosts.length - 1; i++) {
      if (
        traditionalCosts[i].cost < scanningCosts[i].cost &&
        traditionalCosts[i + 1].cost > scanningCosts[i + 1].cost
      ) {
        // Interpolate between months to find exact breakeven
        const m1 = i + 1;
        const m2 = i + 2;
        const t1 = traditionalCosts[i].cost;
        const t2 = traditionalCosts[i + 1].cost;
        const s1 = scanningCosts[i].cost;
        const s2 = scanningCosts[i + 1].cost;

        // Linear interpolation formula
        breakeven = m1 + ((m2 - m1) * (s1 - t1)) / (t2 - t1 - (s2 - s1));
        break;
      }
    }

    // If no crossover found, calculate theoretical breakeven
    if (breakeven === null) {
      const monthlySavings = traditionalMonthlyCost - scanningMonthlyCost;
      breakeven =
        monthlySavings > 0
          ? scanningInfo.initialInvestment / monthlySavings
          : 0;
    }

    // Calculate ROI
    const annualTraditionalCost = traditionalMonthlyCost * 12;
    const annualScanningOperatingCost = scanningMonthlyCost * 12;
    const annualSavings = annualTraditionalCost - annualScanningOperatingCost;
    const roi = (annualSavings / scanningInfo.initialInvestment) * 100;

    // Calculate 5-year ROI
    const fiveYearTraditionalCost = annualTraditionalCost * 5;
    const fiveYearScanningCost =
      annualScanningOperatingCost * 5 + scanningInfo.initialInvestment;
    const fiveYearSavings = fiveYearTraditionalCost - fiveYearScanningCost;
    const fiveYearROI =
      (fiveYearSavings / scanningInfo.initialInvestment) * 100;

    // Calculate time savings per month
    const traditionalMonthlyHours =
      traditionalTotalHours * traditionalInfo.monthlyProjects;
    const scanningMonthlyHours =
      scanningTotalHours * traditionalInfo.monthlyProjects;
    const timeSavings = traditionalMonthlyHours - scanningMonthlyHours;

    // Calculate rework savings
    const reworkPercentage = traditionalInfo.reworkPercentage;
    const traditionalReworkHours =
      traditionalMonthlyHours * (reworkPercentage / 100);
    const traditionalReworkCost =
      traditionalReworkHours *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;

    // Estimated rework reduction with 3D scanning (conservative 50%)
    const scanningReworkReduction = 0.5;
    const reworkSavings = traditionalReworkHours * scanningReworkReduction;
    const reworkCostSavings =
      reworkSavings *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;

    // Combine the data for the chart
    const combinedData = traditionalCosts.map((item, index) => ({
      month: item.month,
      Traditional: item.cost,
      Scanning: scanningCosts[index].cost,
    }));

    // Display first 24 months only
    const displayData = combinedData.slice(0, 24);

    setRoiData({
      combinedData: displayData,
      traditionalCosts,
      scanningCosts,
      timeEfficiencyGain,
      roi,
      breakeven,
      fiveYearROI,
      timeSavings,
      traditionalMonthlyCost,
      scanningMonthlyCost,
      reworkSavings,
      reworkPercentage,
      reworkCostSavings,
    });

    return { roi, breakeven, fiveYearROI, timeSavings, timeEfficiencyGain };
  };

  // Calculate detailed benefit analysis
  const calculateBenefitAnalysis = () => {
    // Base calculations
    const traditionalTotalHours =
      traditionalInfo.fieldMeasurementHours + traditionalInfo.deliverablesHours;
    const traditionalMonthlyHours =
      traditionalTotalHours * traditionalInfo.monthlyProjects;
    const traditionalAnnualHours = traditionalMonthlyHours * 12;

    // Rework hours and cost calculation
    const annualReworkHours =
      traditionalAnnualHours * (traditionalInfo.reworkPercentage / 100);
    const annualReworkCost =
      annualReworkHours *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;

    // Calculate savings based on selected reduction percentage
    const hoursSaved =
      annualReworkHours * (benefitData.selectedReduction / 100);
    const costSaved =
      hoursSaved * traditionalInfo.hourlyRate * traditionalInfo.surveyorCount;

    // Calculate data archival value (estimated as 5% of annual project value)
    const annualLaborCost =
      traditionalAnnualHours *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;
    const annualProjectValue = annualLaborCost * 5; // Multiply by 5 to estimate total project value
    const dataArchivalValue = annualProjectValue * 0.05;

    // Calculate change management savings
    // Assume 10% of projects require significant changes, and 3D scanning saves 50% of rework time
    const changeMgmtProjects = traditionalInfo.monthlyProjects * 12 * 0.1;
    const changeMgmtHoursSaved =
      (traditionalInfo.fieldMeasurementHours +
        traditionalInfo.deliverablesHours) *
      0.5 *
      changeMgmtProjects;
    const changeMgmtSavings =
      changeMgmtHoursSaved *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;

    // Calculate fabrication savings
    // Assume 30% of projects involve prefabrication, and 3D scanning reduces waste by 15%
    const fabricationProjects = Math.max(
      1,
      Math.round(traditionalInfo.monthlyProjects * 12 * 0.3)
    );
    const averageFabricationCost = 35000; // Average cost for fabrication per project
    const fabricationWasteReduction = 0.15; // 15% reduction in waste and rework
    const fabricationSavings =
      fabricationProjects * averageFabricationCost * fabricationWasteReduction;

    // Calculate concrete floor analysis savings
    // Assume 20% of projects involve concrete floor flatness/levelness analysis
    const concreteFloorProjects = Math.max(
      1,
      Math.round(traditionalInfo.monthlyProjects * 12 * 0.2)
    );
    const traditionalFloorAnalysisCost = 2500; // Cost per traditional floor analysis
    const scanningFloorAnalysisCost = 800; // Cost per scanning floor analysis
    const concreteFloorAnalysisSavings =
      concreteFloorProjects *
      (traditionalFloorAnalysisCost - scanningFloorAnalysisCost);

    // Calculate labor savings directly rather than referencing roiData
    const monthlyTimeSavings =
      traditionalMonthlyHours -
      (scanningInfo.scanTimeHours +
        scanningInfo.processingHours +
        scanningInfo.deliverablesHours) *
        traditionalInfo.monthlyProjects;
    const annualTimeSavings = monthlyTimeSavings * 12;
    const laborSavings =
      annualTimeSavings *
      traditionalInfo.hourlyRate *
      traditionalInfo.surveyorCount;

    // Generate chart data
    const errorComparisonData = [
      { name: "Traditional", errors: benefitData.errorReduction.traditional },
      { name: "3D Scanning", errors: benefitData.errorReduction.scanning },
    ];

    const qualityComparisonData = [
      {
        name: "Traditional",
        quality: benefitData.documentationQuality.traditional,
      },
      {
        name: "3D Scanning",
        quality: benefitData.documentationQuality.scanning,
      },
    ];

    const savingsBreakdownData = [
      { name: "Labor Savings", value: laborSavings },
      { name: "Rework Reduction", value: costSaved },
      { name: "Change Management", value: changeMgmtSavings },
      { name: "Data Archival Value", value: dataArchivalValue },
      { name: "Fabrication Savings", value: fabricationSavings },
      { name: "Concrete Floor Analysis", value: concreteFloorAnalysisSavings },
    ];

    setBenefitData((prev) => ({
      ...prev,
      annualReworkHours,
      annualReworkCost,
      hoursSaved,
      costSaved,
      dataArchivalValue,
      changeMgmtSavings,
      fabricationSavings,
      concreteFloorAnalysisSavings,
      errorComparisonData,
      qualityComparisonData,
      savingsBreakdownData,
      laborSavings,
    }));
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total additional benefits value (from checked benefits)
  const calculateTotalAdditionalBenefits = () => {
    let total = 0;

    if (benefitData.enabledBenefits.reworkReduction) {
      total += benefitData.costSaved;
    }

    if (benefitData.enabledBenefits.dataArchival) {
      total += benefitData.dataArchivalValue;
    }

    if (benefitData.enabledBenefits.changeManagement) {
      total += benefitData.changeMgmtSavings;
    }

    if (benefitData.enabledBenefits.fabrication) {
      total += benefitData.fabricationSavings;
    }

    if (benefitData.enabledBenefits.concreteFloor) {
      total += benefitData.concreteFloorAnalysisSavings;
    }

    return total;
  };

  // Validate customer info (all fields required except phone)
  const validateCustomerInfo = () => {
    return (
      customerInfo.companyName.trim() !== "" &&
      customerInfo.contactName.trim() !== "" &&
      customerInfo.zipCode.trim() !== "" &&
      customerInfo.email.trim() !== ""
    );
  };

  // Customer Info Slide
  const renderCustomerInfoSlide = () => (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Customer Information
      </h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="companyName"
            value={customerInfo.companyName}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactName"
            value={customerInfo.contactName}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="zipCode"
            value={customerInfo.zipCode}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={customerInfo.email}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={customerInfo.phone}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        <span className="text-red-500">*</span> Required fields
      </p>
    </div>
  );

  // Traditional & 3D Scanning Info Slide
  const renderInfoSlide = () => (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg mx-auto max-w-4xl">
      <div className="grid grid-cols-2 gap-6">
        {/* Traditional Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-center">
            Traditional Method
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Projects
              </label>
              <input
                type="number"
                name="monthlyProjects"
                value={traditionalInfo.monthlyProjects}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Personnel
              </label>
              <input
                type="number"
                name="surveyorCount"
                value={traditionalInfo.surveyorCount}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                name="hourlyRate"
                value={traditionalInfo.hourlyRate}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Measurement Hours (Per Project)
              </label>
              <input
                type="number"
                name="fieldMeasurementHours"
                value={traditionalInfo.fieldMeasurementHours}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deliverables Hours (Per Project)
              </label>
              <input
                type="number"
                name="deliverablesHours"
                value={traditionalInfo.deliverablesHours}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                step="0.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                CAD Measurements, Heat Maps, FF/FL, etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Typical Rework Percentage (%)
              </label>
              <input
                type="number"
                name="reworkPercentage"
                value={traditionalInfo.reworkPercentage}
                onChange={handleTraditionalInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* 3D Scanning Information */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-center">
            3D Scanning Method
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scanner Model
              </label>
              <select
                name="scannerModel"
                value={scanningInfo.scannerModel}
                onChange={handleScanningInfoChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="X9 Core">X9 Core</option>
                <option value="X9 Premium">X9 Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Operators
              </label>
              <input
                type="number"
                name="operatorCount"
                value={scanningInfo.operatorCount}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                Fixed Operator Count for 3D Scanning
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scanning Time (Hours Per Project)
              </label>
              <input
                type="number"
                name="scanTimeHours"
                value={scanningInfo.scanTimeHours.toFixed(1)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                33% of Traditional Field Measurement Time
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processing Time (Hours Per Project)
              </label>
              <input
                type="number"
                name="processingHours"
                value={scanningInfo.processingHours.toFixed(1)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">25% of Scanning Time</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deliverables Time (Hours Per Project)
              </label>
              <input
                type="number"
                name="deliverablesHours"
                value={scanningInfo.deliverablesHours.toFixed(1)}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                10% of Traditional Deliverables Time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ROI Dashboard Slide
  const renderROIDashboardSlide = () => (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        3D Scanning ROI Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Productivity Increase */}
        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-blue-500 text-white p-3 rounded-full">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Time Efficiency Gain</h3>
            <p className="text-3xl font-bold text-blue-600">
              {roiData.timeEfficiencyGain.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Return on Investment */}
        <div className="bg-green-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-green-500 text-white p-3 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Annual ROI</h3>
            <p className="text-3xl font-bold text-green-600">
              {roiData.roi.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* 5-Year ROI */}
        <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-indigo-500 text-white p-3 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">5-Year ROI</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {roiData.fiveYearROI.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Time Savings */}
        <div className="bg-rose-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-rose-500 text-white p-3 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Monthly Time Savings</h3>
            <p className="text-3xl font-bold text-rose-600">
              {roiData.timeSavings.toFixed(1)} hours
            </p>
          </div>
        </div>

        {/* Breakeven Point */}
        <div className="bg-purple-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-purple-500 text-white p-3 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Breakeven Point</h3>
            <p className="text-3xl font-bold text-purple-600">
              {roiData.breakeven
                ? `${roiData.breakeven.toFixed(1)} months`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Total Investment */}
        <div className="bg-amber-50 p-4 rounded-lg flex items-center">
          <div className="mr-4 bg-amber-500 text-white p-3 rounded-full">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Investment</h3>
            <p className="text-3xl font-bold text-amber-600">
              {formatCurrency(scanningInfo.initialInvestment)}
            </p>
          </div>
        </div>
      </div>

      {/* Breakeven Point Graph */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Breakeven Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roiData.combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Traditional"
                stroke="#3B82F6"
                name="Traditional Cost"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Scanning"
                stroke="#10B981"
                name="3D Scanning Cost (with investment)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Breakeven Point Explanation */}
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <h4 className="text-md font-medium text-yellow-800">
                Breakeven Analysis
              </h4>
              <p className="mt-1 text-sm text-yellow-700">
                The graph shows cumulative costs for both traditional methods
                and 3D scanning solutions over time.
                {roiData.breakeven &&
                roiData.breakeven > 0 &&
                roiData.breakeven <= 24 ? (
                  <span>
                    {" "}
                    The breakeven point occurs at{" "}
                    <strong>{roiData.breakeven.toFixed(1)} months</strong>,
                    where the lines cross. At this point, the initial investment
                    in 3D scanning equipment is offset by the monthly labor
                    savings of{" "}
                    {formatCurrency(
                      roiData.traditionalMonthlyCost -
                        roiData.scanningMonthlyCost
                    )}
                    . After this point, the scanning solution becomes more
                    cost-effective.
                  </span>
                ) : roiData.breakeven > 24 ? (
                  <span>
                    {" "}
                    The breakeven point occurs beyond the 24-month period shown
                    on this graph. With the current inputs, it would take{" "}
                    <strong>{roiData.breakeven.toFixed(1)} months</strong> to
                    recover the initial investment of{" "}
                    {formatCurrency(scanningInfo.initialInvestment)}.
                  </span>
                ) : (
                  <span>
                    {" "}
                    Based on current inputs, a clear breakeven point could not
                    be determined. The monthly savings may not be sufficient to
                    offset the initial investment in the timeframe analyzed.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Benefit Analysis Slide
  const renderBenefitAnalysisSlide = () => (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg mx-auto max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        3D Scanning Benefits Analysis
      </h2>

      {/* Rework Reduction Control */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          Rework Reduction Percentage
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">40%</span>
            <span className="text-sm font-medium text-blue-700">
              {benefitData.selectedReduction}%
            </span>
            <span className="text-sm font-medium text-gray-700">80%</span>
          </div>
          <input
            type="range"
            min={benefitData.reductionRanges.min}
            max={benefitData.reductionRanges.max}
            value={benefitData.selectedReduction}
            onChange={handleReductionChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-sm text-gray-600 mt-2">
            Based on industry data, 3D scanning solutions can reduce rework by
            40% to 80%. Adjust the slider to see different reduction scenarios.
          </p>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Annual Rework Hours */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-1">
            Annual Rework Hours (Traditional)
          </h3>
          <p className="text-2xl font-bold text-red-600">
            {benefitData.annualReworkHours.toFixed(1)} hours
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Based on {traditionalInfo.reworkPercentage}% rework for traditional
            methods
          </p>
        </div>

        {/* Hours Saved */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-1">
            Annual Hours Saved with 3D Scanning
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {benefitData.hoursSaved.toFixed(1)} hours
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {benefitData.selectedReduction}% reduction in rework hours
          </p>
        </div>

        {/* Labor Cost Savings */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-1">Rework Cost Savings</h3>
          <p className="text-2xl font-bold text-indigo-600">
            {formatCurrency(benefitData.costSaved)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Direct savings from reduced rework labor hours
          </p>
        </div>

        {/* Data Archival Value */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-1">Data Archival Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(benefitData.dataArchivalValue)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Long-term value of comprehensive digital documentation
          </p>
        </div>
      </div>

      {/* Benefits Analysis Detail */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Benefits Analysis Breakdown
        </h3>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                <CheckCircle size={18} className="text-green-500 mr-2" />
                Rework Reduction (40-80%)
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableRework"
                  checked={benefitData.enabledBenefits.reworkReduction}
                  onChange={() => handleBenefitToggle("reworkReduction")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableRework"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include in ROI
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              3D scanning technology reduces rework by providing accurate
              as-built conditions, detecting clashes early, and enabling better
              planning. At {benefitData.selectedReduction}% reduction, you'll
              save {benefitData.hoursSaved.toFixed(1)} hours of labor annually
              that would otherwise be spent on rework.
            </p>
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 text-xs text-white flex items-center justify-center"
                style={{ width: `${benefitData.selectedReduction}%` }}
              >
                {benefitData.selectedReduction}%
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                <CheckCircle size={18} className="text-blue-500 mr-2" />
                Quality & Documentation Improvements
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableDataArchival"
                  checked={benefitData.enabledBenefits.dataArchival}
                  onChange={() => handleBenefitToggle("dataArchival")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableDataArchival"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include in ROI
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              3D scanning provides comprehensive documentation with
              millimeter-level accuracy. Benefits include:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
              <li>
                Reduction in measurement errors and greater confidence in design
              </li>
              <li>Complete digital twins of facilities for future reference</li>
              <li>Enhanced visualization for stakeholders</li>
              <li>Better coordination across disciplines</li>
            </ul>
            <p className="text-sm text-gray-700">
              The estimated annual value of improved documentation:{" "}
              {formatCurrency(benefitData.dataArchivalValue)}
            </p>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                <CheckCircle size={18} className="text-purple-500 mr-2" />
                Change Management Benefits
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableChangeMgmt"
                  checked={benefitData.enabledBenefits.changeManagement}
                  onChange={() => handleBenefitToggle("changeManagement")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableChangeMgmt"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include in ROI
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              When changes occur during projects, 3D scanning offers significant
              advantages:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
              <li>Quick verification of existing conditions</li>
              <li>Ability to plan around existing infrastructure</li>
              <li>Reduced site revisits for additional measurements</li>
              <li>Faster response to field changes and RFIs</li>
            </ul>
            <p className="text-sm text-gray-700">
              Estimated annual savings from improved change management:{" "}
              {formatCurrency(benefitData.changeMgmtSavings)}
            </p>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                <CheckCircle size={18} className="text-orange-500 mr-2" />
                Fabrication Savings
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableFabrication"
                  checked={benefitData.enabledBenefits.fabrication}
                  onChange={() => handleBenefitToggle("fabrication")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableFabrication"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include in ROI
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              3D scanning dramatically improves prefabrication accuracy and
              efficiency:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
              <li>Precise measurements enable first-time-fit fabrication</li>
              <li>Reduces material waste during fabrication</li>
              <li>Minimizes field modifications to prefabricated components</li>
              <li>
                Enables more complex prefabrication with higher confidence
              </li>
              <li>Reduces logistics costs from incorrect components</li>
            </ul>
            <p className="text-sm text-gray-700">
              Estimated annual savings from improved fabrication:{" "}
              {formatCurrency(benefitData.fabricationSavings)}
            </p>
          </div>

          <div className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 flex items-center">
                <CheckCircle size={18} className="text-teal-500 mr-2" />
                Concrete Floor Analysis Benefits
              </h4>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableConcreteFloor"
                  checked={benefitData.enabledBenefits.concreteFloor}
                  onChange={() => handleBenefitToggle("concreteFloor")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="enableConcreteFloor"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include in ROI
                </label>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              3D scanning provides superior concrete floor flatness/levelness
              analysis:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700 mb-3">
              <li>
                Collects millions of data points vs. sparse traditional
                measurements
              </li>
              <li>Creates comprehensive heat maps of entire floors</li>
              <li>Identifies problem areas earlier in construction</li>
              <li>Reduces remediation costs through early detection</li>
              <li>Provides better documentation for compliance/handover</li>
            </ul>
            <p className="text-sm text-gray-700">
              Estimated annual savings from improved concrete floor analysis:{" "}
              {formatCurrency(benefitData.concreteFloorAnalysisSavings)}
            </p>
          </div>
        </div>
      </div>

      {/* ROI Impact Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold mb-3">Impact on ROI</h3>
        <p className="text-sm text-gray-700 mb-4">
          When factoring in selected benefits, the return on your 3D scanning
          investment becomes even more compelling:
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-gray-800 mb-1">
              Standard ROI (Labor Savings)
            </h4>
            <p className="text-xl font-bold text-blue-600">
              {Math.round(roiData.roi)}%
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-gray-800 mb-1">
              Enhanced ROI (With Selected Benefits)
            </h4>
            <p className="text-xl font-bold text-green-600">
              {Math.round(
                roiData.roi +
                  (calculateTotalAdditionalBenefits() /
                    scanningInfo.initialInvestment) *
                    100
              )}
              %
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-gray-800 mb-1">
              Standard Payback (Labor Savings)
            </h4>
            <p className="text-xl font-bold text-blue-600">
              {Math.round(roiData.breakeven)} months
            </p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <h4 className="font-medium text-gray-800 mb-1">
              Enhanced Payback (With Selected Benefits)
            </h4>
            <p className="text-xl font-bold text-green-600">
              {Math.round(
                scanningInfo.initialInvestment /
                  (roiData.traditionalMonthlyCost -
                    roiData.scanningMonthlyCost +
                    calculateTotalAdditionalBenefits() / 12)
              )}{" "}
              months
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">
          3D Scanning ROI Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Calculate your return on investment with 3D scanning solutions for
          construction
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentSlide >= 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              1
            </div>
            <div
              className={`w-16 h-1 ${
                currentSlide > 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentSlide >= 2 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <div
              className={`w-16 h-1 ${
                currentSlide > 2 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentSlide >= 3 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              3
            </div>
            <div
              className={`w-16 h-1 ${
                currentSlide > 3 ? "bg-blue-500" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentSlide >= 4 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              4
            </div>
          </div>
        </div>

        {/* Content slides */}
        <div className="mb-8">
          {currentSlide === 1 && renderCustomerInfoSlide()}
          {currentSlide === 2 && renderInfoSlide()}
          {currentSlide === 3 && renderROIDashboardSlide()}
          {currentSlide === 4 && renderBenefitAnalysisSlide()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center space-x-4">
          {currentSlide > 1 && (
            <button
              onClick={prevSlide}
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </button>
          )}

          {currentSlide === 1 && (
            <button
              onClick={nextSlide}
              disabled={!validateCustomerInfo()}
              className={`flex items-center ${
                validateCustomerInfo()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white px-4 py-2 rounded-md transition duration-200`}
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          )}

          {currentSlide === 2 && (
            <button
              onClick={nextSlide}
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Calculate ROI
              <ArrowRight size={16} className="ml-2" />
            </button>
          )}

          {currentSlide === 3 && (
            <button
              onClick={nextSlide}
              className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              View Benefits Analysis
              <ArrowRight size={16} className="ml-2" />
            </button>
          )}

          {/* {currentSlide === 4 && (
            <button className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200">
              Generate Report
              <ArrowRight size={16} className="ml-2" />
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
