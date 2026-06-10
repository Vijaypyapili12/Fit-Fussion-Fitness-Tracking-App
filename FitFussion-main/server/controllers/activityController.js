import Activity from "../models/Activity.js";

// @desc    Create new activity bound to logged-in user
// @route   POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { type, duration, caloriesBurned } = req.body;

    if (!type || duration === "" || caloriesBurned === "" || duration === undefined || caloriesBurned === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Pass req.user._id straight into the initialization block
    const newActivity = new Activity({ 
      user: req.user._id, // Separates ownership
      type, 
      duration: Number(duration), 
      caloriesBurned: Number(caloriesBurned) 
    });
    
    await newActivity.save();
    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    console.error("Error creating activity:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get only the logged-in user's activities
// @route   GET /api/activities
export const getActivities = async (req, res) => {
  try {
    // Only query activities matching this specific user's ID
    const activities = await Activity.find({ user: req.user._id });
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Add incremental progress (duration/calories) to an existing activity
// @route   PUT /api/activities/:id
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { additionalDuration, additionalCalories } = req.body;

    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }

    // Safety Lockout: Prevent user2 from modifying user1's workout entries
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to update this record." });
    }

    // Mathematical accumulation calculation: safely increments the existing storage variables
    activity.duration += Number(additionalDuration) || 0;
    activity.caloriesBurned += Number(additionalCalories) || 0;

    await activity.save();
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    console.error("Error updating activity progress:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Delete activity with an ownership safeguard check
// @route   DELETE /api/activities/:id
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ success: false, message: "Activity not found" });
    }

    // Safety Lockout
    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "User not authorized to delete this record." });
    }

    await activity.deleteOne();
    res.status(200).json({ success: true, message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};