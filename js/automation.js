/**
 * SV Electricals & Smart Home Automation - Interactive Experience Script
 */

(function () {
    "use strict";

    // Wait until DOM is loaded
    document.addEventListener("DOMContentLoaded", function () {
        initRoomSimulator();
        initPortfolioFilter();
        initProjectModal();
        initSmartEstimator();
    });

    /* ==========================================================================
       1. Interactive Smart Living Room Simulator
       ========================================================================== */
    function initRoomSimulator() {
        const lightOverlay = document.getElementById("simLightOverlay");
        const roomBg = document.getElementById("simRoomBg");
        const curtainContainer = document.getElementById("simCurtainsWrap");
        const fanWidget = document.getElementById("simFanWidget");
        const statusModeText = document.getElementById("simStatusMode");
        const statusPowerText = document.getElementById("simStatusPower");

        if (!lightOverlay || !curtainContainer || !fanWidget) return;

        // Current states
        let currentLight = "warm";
        let currentCurtains = "open";
        let currentFan = "3";

        // Light buttons
        const lightBtns = document.querySelectorAll(".sim-light-btn");
        lightBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                lightBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                currentLight = this.dataset.light;
                applyLightState(currentLight);
                clearPresetActive();
                updateTelemetry();
            });
        });

        // Curtain buttons
        const curtainBtns = document.querySelectorAll(".sim-curtain-btn");
        curtainBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                curtainBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                currentCurtains = this.dataset.curtain;
                applyCurtainState(currentCurtains);
                clearPresetActive();
                updateTelemetry();
            });
        });

        // Fan buttons
        const fanBtns = document.querySelectorAll(".sim-fan-btn");
        fanBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                fanBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                currentFan = this.dataset.fan;
                applyFanState(currentFan);
                clearPresetActive();
                updateTelemetry();
            });
        });

        // Preset Scene buttons
        const presetBtns = document.querySelectorAll(".preset-btn");
        presetBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                presetBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");

                const scene = this.dataset.scene;
                applyPresetScene(scene);
            });
        });

        function applyLightState(mode) {
            lightOverlay.className = "simulator-light-overlay light-mode-" + mode;
            if (mode === "off") {
                if (roomBg) roomBg.style.filter = "brightness(0.35) contrast(1.1)";
            } else if (mode === "cinema") {
                if (roomBg) roomBg.style.filter = "brightness(0.55) saturate(1.3)";
            } else {
                if (roomBg) roomBg.style.filter = "brightness(1) saturate(1)";
            }
        }

        function applyCurtainState(state) {
            curtainContainer.className = "curtains-" + state;
        }

        function applyFanState(speed) {
            fanWidget.className = "simulator-fan-widget fan-speed-" + speed;
            const fanSpeedLabel = document.getElementById("simFanSpeedLabel");
            if (fanSpeedLabel) {
                fanSpeedLabel.textContent = speed === "off" ? "Fan Off" : "Fan Speed " + speed;
            }
        }

        function applyPresetScene(scene) {
            if (scene === "cinema") {
                currentLight = "cinema";
                currentCurtains = "closed";
                currentFan = "1";
            } else if (scene === "morning") {
                currentLight = "daylight";
                currentCurtains = "open";
                currentFan = "3";
            } else if (scene === "relax") {
                currentLight = "warm";
                currentCurtains = "half";
                currentFan = "3";
            } else if (scene === "party") {
                currentLight = "party";
                currentCurtains = "half";
                currentFan = "5";
            } else if (scene === "away") {
                currentLight = "off";
                currentCurtains = "closed";
                currentFan = "off";
            }

            // Sync controls
            syncButtonStates();
            applyLightState(currentLight);
            applyCurtainState(currentCurtains);
            applyFanState(currentFan);
            updateTelemetry(scene.toUpperCase());
        }

        function syncButtonStates() {
            lightBtns.forEach(b => b.classList.toggle("active", b.dataset.light === currentLight));
            curtainBtns.forEach(b => b.classList.toggle("active", b.dataset.curtain === currentCurtains));
            fanBtns.forEach(b => b.classList.toggle("active", b.dataset.fan === currentFan));
        }

        function clearPresetActive() {
            presetBtns.forEach(b => b.classList.remove("active"));
        }

        function updateTelemetry(customName) {
            let watts = 0;
            // Approximate smart load calculation
            if (currentLight === "warm") watts += 38;
            else if (currentLight === "party") watts += 45;
            else if (currentLight === "daylight") watts += 42;
            else if (currentLight === "cinema") watts += 18;

            if (currentFan === "1") watts += 6;
            else if (currentFan === "3") watts += 14;
            else if (currentFan === "5") watts += 28;

            // Idle standby
            watts += 4;

            if (statusModeText) {
                statusModeText.textContent = customName || (currentLight.toUpperCase() + " SCENE");
            }
            if (statusPowerText) {
                statusPowerText.textContent = watts + "W (Eco Active)";
            }
        }

        // Initialize defaults
        applyLightState("warm");
        applyCurtainState("open");
        applyFanState("3");
        updateTelemetry("WARM EVENING");
    }

    /* ==========================================================================
       2. Portfolio Category Filtering
       ========================================================================== */
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll(".portfolio-filter-btn");
        const portfolioCards = document.querySelectorAll(".portfolio-card-item");

        if (!filterBtns.length || !portfolioCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                filterBtns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");

                const targetCategory = this.dataset.filter;

                portfolioCards.forEach(card => {
                    const cardCategory = card.dataset.category || "";
                    const cardCategories = cardCategory.split(" ");

                    if (targetCategory === "all" || cardCategories.includes(targetCategory)) {
                        card.style.display = "block";
                        setTimeout(() => {
                            card.style.opacity = "1";
                            card.style.transform = "scale(1)";
                        }, 20);
                    } else {
                        card.style.opacity = "0";
                        card.style.transform = "scale(0.95)";
                        setTimeout(() => {
                            card.style.display = "none";
                        }, 300);
                    }
                });
            });
        });
    }

    /* ==========================================================================
       3. Project Specifications Modal
       ========================================================================== */
    const projectDatabase = {
        "palm-penthouse": {
            title: "The Palm Luxury Penthouse",
            client: "Private Residence | JP Nagar 7th Phase",
            img: "images/smart_villa.jpg",
            category: "Complete Smart Home Automation",
            description: "A 4,500 sq.ft luxury penthouse fitted with end-to-end automation. Features automated circadian architectural cove lighting, dual motorized curtain tracks in all bedrooms and living areas, IoT smart BLDC ceiling fans, and luxury feather-touch black glass switch panels.",
            highlights: [
                "48 Independent Smart Lighting & Dimming Channels",
                "8 Motorized Blackout & Sheer Curtain Tracks (Somfy/Tuya)",
                "6 Smart BLDC Whisper-Quiet Ceiling Fans with Ambient LED",
                "12 Feather-Touch Luxury Capacitive Glass Panels",
                "Apple HomeKit, Google Home & Alexa Voice Integration",
                "Integrated Smart Biometric Door Lock & Video Doorbell"
            ],
            specs: {
                "Area": "4,500 sq.ft (Duplex Penthouse)",
                "Protocol": "Zigbee 3.0 & Matter over Thread",
                "Execution Time": "3 Weeks",
                "Energy Reduction": "Estimated 34% Lower Lighting & HVAC Load"
            }
        },
        "emerald-curtains": {
            title: "Emerald Heights Motorized Drapery",
            client: "Villa Residence | Koramangala 4th Block",
            img: "images/smart_curtains.jpg",
            category: "Motorized Curtains & Blinds",
            description: "High-ceiling motorized drapery automation with smart sun-tracking sensors. Curtains automatically draw open at sunrise and close during peak heat hours to preserve indoor cooling and reduce HVAC bills.",
            highlights: [
                "Heavy Velvet Blackout + Sheer Dual-Track System",
                "Whisper-Quiet <30dB Motor Operation with Soft Start & Stop",
                "Manual Pull-to-Start Trigger (Gentle Tug Starts Motor)",
                "Astronomical Sunrise/Sunset Scheduling via Mobile App",
                "Voice-Controlled via Siri, Alexa, and Google Assistant"
            ],
            specs: {
                "Track Length": "Total 42 Running Meters",
                "Motors": "Heavy-Duty Dual DC Motors with RF & Zigbee",
                "Curtain Weight Capacity": "Up to 60 kg per motor",
                "Execution Time": "5 Days"
            }
        },
        "azure-lighting": {
            title: "Azure Cove Architectural Smart Lighting",
            client: "Modern Apartment | Indiranagar",
            img: "images/smart_lighting.jpg",
            category: "Smart Architectural Lighting",
            description: "Custom ambient cove lighting and magnetic track lighting system. Includes tunable white light from 2200K (candle warmth) to 5000K (crisp daylight), with synchronized RGB wall washers in the entertainment lounge.",
            highlights: [
                "Tunable White CCT Dimming (0.1% to 100% flicker-free)",
                "Human-Centric Circadian Rhythm Auto-Shifting",
                "Magnetic Track Recessed Downlights with Zone Control",
                "One-Touch 'Cinema' and 'Entertaining' Lighting Presets"
            ],
            specs: {
                "Cove Length": "85 Meters COB LED Strip",
                "Control Protocol": "DALI-2 / Zigbee Smart Dimmer Drivers",
                "CRI Index": ">95 High Color Rendering",
                "Execution Time": "10 Days"
            }
        },
        "solaris-fans": {
            title: "Solaris Master Suite Fans & Climate",
            client: "Luxury Residence | Whitefield",
            img: "images/smart_fans.jpg",
            category: "Smart Fans & Climate Control",
            description: "Next-gen smart BLDC ceiling fans seamlessly linked with climate thermostats and room occupancy sensors. Fans run silently, automatically adjusting speed as room temperature cools through the night.",
            highlights: [
                "Energy-Saving BLDC Motor (Only 28W at full speed vs 75W normal)",
                "Sleep Curve: Dynamically reduces speed by 1 level every 2 hours",
                "Integrated 18W Dimmable Warm LED Ring",
                "Reverse Winter Mode for Heat Circulation"
            ],
            specs: {
                "Units Installed": "7 Smart BLDC IoT Fans",
                "Noise Level": "Ultra-Quiet < 32 dB",
                "Connectivity": "Dual WiFi 2.4GHz + BLE Mesh",
                "Execution Time": "3 Days"
            }
        },
        "crystal-touch": {
            title: "Crystal Touch Glass Switch Panels",
            client: "Boutique Residence | HSR Layout",
            img: "images/smart_switches.jpg",
            category: "Smart Touch Panels & Retrofit",
            description: "Installed without any wall grooving or breaking existing wiring. Seamless retrofit behind and onto standard modular metal conceal boxes with luxury tempered glass touch screens and backlit iconography.",
            highlights: [
                "Zero Rewiring / Retrofittable into Standard Modular Boxes",
                "Tempered Crystal Glass with Anti-Fingerprint Coating",
                "Soft Ambient Backlit Icons (Auto-Dims in Darkness)",
                "Capacitive Feather Touch with Haptic Feedback"
            ],
            specs: {
                "Switches Installed": "36 Gangs Across 8 Modular Plates",
                "Safety": "Sparkless & Shockproof, Safe for Wet Hands",
                "Surge Protection": "Integrated 4kV Transient Surge Suppressor",
                "Execution Time": "4 Days"
            }
        },
        "stellar-cinema": {
            title: "Stellar Horizon Private Cinema",
            client: "Home Theater Suite | Sadashivanagar",
            img: "images/smart_cinema.jpg",
            category: "Home Theater & Multi-Room Automation",
            description: "Immersive private cinema automation. A single tap on the 'Start Movie' switch closes motorized blackout blinds, dims starry optical fiber ceiling, and fires up the surround sound and projector.",
            highlights: [
                "Fiber Optic Starfield Constellation Ceiling with Twinkle",
                "Motorized 100% Blackout Roller Shades",
                "DMX RGB Acoustic Wall Sconce Syncing",
                "Integrated AV Automation & Universal Controller"
            ],
            specs: {
                "Screen Size": "160-inch 4K HDR Projection",
                "Control System": "Automated Scene Gateway + Tablet UI",
                "Execution Time": "2 Weeks"
            }
        },
        "pub-1522": {
            title: "1522 The Pub - Electrical & Lighting",
            client: "Commercial Hospitality | Bengaluru",
            img: "images/15221.webp",
            category: "Commercial Electrical Contracting",
            description: "Complete commercial electrical installation, main distribution panels, architectural mood lighting, high-load backup generator synchronizers, and comprehensive circuit breaker protection.",
            highlights: [
                "LT Panel Fabrication & Busbar Trunking Installation",
                "Hospitality Grade Ambient Dimmable Lighting Layout",
                "Emergency Auto Mains Failure (AMF) Generator Switchover",
                "Complete Safety Earthing & Lightning Protection"
            ],
            specs: {
                "Connected Load": "120 kVA",
                "Type": "Full Turnkey Commercial Electrical Layout",
                "Execution Time": "6 Weeks"
            }
        },
        "prime-golf": {
            title: "Prime Golf Experience Facility",
            client: "Sports & Leisure Complex | Bengaluru",
            img: "images/prime1.avif",
            category: "Commercial Electrical Contracting",
            description: "Heavy-duty commercial electrification, turf floodlighting, high-capacity switchgear panels, and CCTV security network for a premier golf and entertainment center.",
            highlights: [
                "High-Mast Floodlight Installation with Surge Arrester",
                "Substation & Distribution Board Cabling",
                "32-Channel IP CCTV Security Surveillance Backbone",
                "Energy-Saving Timing Relays for Outdoor Lighting"
            ],
            specs: {
                "Connected Load": "180 kVA",
                "Type": "Outdoor & Indoor Sports Infrastructure",
                "Execution Time": "8 Weeks"
            }
        }
    };

    function initProjectModal() {
        const specButtons = document.querySelectorAll(".btn-view-specs");
        const modalElement = document.getElementById("projectDetailModal");
        if (!modalElement || !specButtons.length) return;

        const modalTitle = document.getElementById("modalProjTitle");
        const modalClient = document.getElementById("modalProjClient");
        const modalCategory = document.getElementById("modalProjCategory");
        const modalImg = document.getElementById("modalProjImg");
        const modalDesc = document.getElementById("modalProjDesc");
        const modalHighlights = document.getElementById("modalProjHighlights");
        const modalSpecsTable = document.getElementById("modalProjSpecsTable");
        const modalWhatsAppBtn = document.getElementById("modalProjWhatsAppBtn");

        specButtons.forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const projId = this.dataset.project;
                const proj = projectDatabase[projId];

                if (!proj) return;

                if (modalTitle) modalTitle.textContent = proj.title;
                if (modalClient) modalClient.textContent = proj.client;
                if (modalCategory) modalCategory.textContent = proj.category;
                if (modalImg) modalImg.src = proj.img;
                if (modalDesc) modalDesc.textContent = proj.description;

                // Highlights
                if (modalHighlights) {
                    modalHighlights.innerHTML = "";
                    proj.highlights.forEach(item => {
                        const li = document.createElement("li");
                        li.className = "mb-2 d-flex align-items-start";
                        li.innerHTML = `<i class="fas fa-check-circle text-primary me-2 mt-1"></i><span>${item}</span>`;
                        modalHighlights.appendChild(li);
                    });
                }

                // Specs Table
                if (modalSpecsTable) {
                    modalSpecsTable.innerHTML = "";
                    for (const [key, val] of Object.entries(proj.specs)) {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `<th style="width: 40%;" class="ps-3">${key}</th><td class="ps-3">${val}</td>`;
                        modalSpecsTable.appendChild(tr);
                    }
                }

                // WhatsApp action pre-filled
                if (modalWhatsAppBtn) {
                    const message = encodeURIComponent(`Hi SV Electricals & Automation, I saw your project "${proj.title}" on your portfolio. I would like a consultation for similar automation/electrical work.`);
                    modalWhatsAppBtn.href = `https://wa.me/919060602727?text=${message}`;
                }

                // Show Bootstrap modal
                if (window.bootstrap && bootstrap.Modal) {
                    const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
                    bsModal.show();
                } else {
                    $(modalElement).modal("show");
                }
            });
        });
    }

    /* ==========================================================================
       4. Interactive Smart Home Package Estimator
       ========================================================================== */
    function initSmartEstimator() {
        const propOptions = document.querySelectorAll(".prop-option");
        const featureToggles = document.querySelectorAll(".feature-toggle-item");
        const estimateBadge = document.getElementById("estimatorPriceDisplay");
        const estimateSummaryDesc = document.getElementById("estimatorSummaryDesc");
        const estimateWhatsAppBtn = document.getElementById("estimatorWhatsAppBtn");

        if (!propOptions.length || !featureToggles.length || !estimateBadge) return;

        let selectedProp = "3bhk";
        let propBaseRates = {
            "2bhk": { name: "2 BHK Apartment", base: 45000, mult: 1.0 },
            "3bhk": { name: "3 BHK Apartment", base: 75000, mult: 1.4 },
            "villa": { name: "4 BHK / Luxury Villa", base: 140000, mult: 2.2 },
            "commercial": { name: "Commercial / Office / Cafe", base: 120000, mult: 1.8 }
        };

        let selectedFeatures = {
            "lights": true,
            "curtains": true,
            "fans": true,
            "switches": true,
            "lock": false
        };

        let featureCosts = {
            "lights": 28000,
            "curtains": 32000,
            "fans": 18000,
            "switches": 25000,
            "lock": 22000
        };

        // Property click
        propOptions.forEach(opt => {
            opt.addEventListener("click", function () {
                propOptions.forEach(o => o.classList.remove("active"));
                this.classList.add("active");
                selectedProp = this.dataset.prop;
                calculateEstimate();
            });
        });

        // Feature toggle click
        featureToggles.forEach(item => {
            item.addEventListener("click", function () {
                const featureKey = this.dataset.feature;
                selectedFeatures[featureKey] = !selectedFeatures[featureKey];
                this.classList.toggle("checked", selectedFeatures[featureKey]);
                
                const checkIcon = this.querySelector(".custom-switch-check i");
                if (checkIcon) {
                    checkIcon.style.opacity = selectedFeatures[featureKey] ? "1" : "0";
                }

                calculateEstimate();
            });
        });

        function calculateEstimate() {
            const propData = propBaseRates[selectedProp] || propBaseRates["3bhk"];
            let total = 0;
            let activeFeaturesList = [];

            for (const [key, isEnabled] of Object.entries(selectedFeatures)) {
                if (isEnabled) {
                    total += featureCosts[key] * propData.mult;
                    if (key === "lights") activeFeaturesList.push("Smart Lights");
                    if (key === "curtains") activeFeaturesList.push("Motorized Curtains");
                    if (key === "fans") activeFeaturesList.push("Smart Fans");
                    if (key === "switches") activeFeaturesList.push("Touch Panels");
                    if (key === "lock") activeFeaturesList.push("Smart Lock");
                }
            }

            // Round nicely to thousands
            const lowerBound = Math.round((total * 0.9) / 1000) * 1000;
            const upperBound = Math.round((total * 1.15) / 1000) * 1000;

            const formattedLower = "₹" + lowerBound.toLocaleString("en-IN");
            const formattedUpper = "₹" + upperBound.toLocaleString("en-IN");

            estimateBadge.textContent = `${formattedLower} - ${formattedUpper}`;

            if (estimateSummaryDesc) {
                estimateSummaryDesc.textContent = `Estimated for ${propData.name} including ${activeFeaturesList.join(", ") || "Standard Setup"}. Includes hardware, setup, testing & warranty.`;
            }

            if (estimateWhatsAppBtn) {
                const message = encodeURIComponent(`Hello SV Electricals & Automation, I used your website estimator for ${propData.name}.\n\nFeatures selected:\n- ${activeFeaturesList.join("\n- ")}\n\nEstimated Range: ${formattedLower} - ${formattedUpper}.\nI would like to book a free site inspection & customized quote.`);
                estimateWhatsAppBtn.href = `https://wa.me/919060602727?text=${message}`;
            }
        }

        // Initialize calculation
        calculateEstimate();
    }

})();
