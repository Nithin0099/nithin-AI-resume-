const downloadPdf = async () => {
        // Select buttons to hide
        const buttons = document.querySelectorAll('.download-btn');
        const entryButtons = document.querySelectorAll('.add-btn, .remove-btn');
        const removeSectionButtons = document.querySelectorAll('.remove-section-btn');

        // Hide the buttons
        buttons.forEach(button => button.style.display = 'none');
        entryButtons.forEach(button => button.style.display = 'none');
        removeSectionButtons.forEach(button => button.style.display = 'none');

        // Color mapping for Tailwind classes
        const colorMap = {
            'blue': '#3b82f6',
            'purple': '#9333ea',
            'red': '#ef4444',
            'green': '#22c55e',
            'yellow': '#eab308',
            'gray': '#6b7280',
            'white': '#ffffff',
            'black': '#000000'
        };

        try {
            // Clone the element to avoid modifying the original
            const element = document.getElementById("resumeBody");
            const clone = element.cloneNode(true);

            // Process all elements with potentially problematic styles
            const allElements = clone.querySelectorAll('*');

            allElements.forEach(el => {
                // Handle background colors
                if (el.classList) {
                    el.classList.forEach(className => {
                        // Process bg-color classes
                        if (className.startsWith('bg-')) {
                            // Extract color name (e.g., 'blue' from 'bg-blue-600')
                            const colorParts = className.split('-');
                            if (colorParts.length >= 2) {
                                const colorName = colorParts[1];
                                // Apply a safe color if we have a mapping
                                if (colorMap[colorName]) {
                                    el.style.backgroundColor = colorMap[colorName];
                                    el.classList.remove(className);
                                }
                            }
                        }

                        // Process text color classes
                        if (className.startsWith('text-')) {
                            const colorParts = className.split('-');
                            if (colorParts.length >= 2) {
                                const colorName = colorParts[1];
                                if (colorMap[colorName]) {
                                    el.style.color = colorMap[colorName];
                                    el.classList.remove(className);
                                }
                            }
                        }
                    });
                }
            });

            // Fix header alignment issues
            const headings = clone.querySelectorAll('.headings');
            headings.forEach(heading => {
                // Apply explicit styles to ensure proper alignment
                heading.style.textAlign = 'left';
                heading.style.fontWeight = 'bold';
                heading.style.fontSize = '18px';
                heading.style.marginTop = '15px';
                heading.style.marginBottom = '8px';
                heading.style.borderBottom = '1px solid #ccc';
                heading.style.paddingBottom = '5px';
                heading.style.width = '100%';
                heading.style.display = 'block';
            });

            // Fix first block alignment
            const firstBlock = clone.querySelector('.firstBlock');
            if (firstBlock) {
                firstBlock.style.textAlign = 'left';
                firstBlock.style.marginBottom = '20px';
            }

            // Fix section blocks alignment
            const sectionBlocks = clone.querySelectorAll('.summaryblock, .experienceblock, .educationblock, .achievementblock, .skillsblock, .certificationcourse, .projectblock');
            sectionBlocks.forEach(block => {
                block.style.width = '100%';
                block.style.marginBottom = '15px';
                block.style.textAlign = 'left';
            });

            // Create a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.appendChild(clone);
            document.body.appendChild(tempContainer);

            // Configure html2pdf options
            const options = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: "resume.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    // This can help with layout issues
                    windowWidth: 1024,
                    letterRendering: true
                },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "portrait",
                    compress: true
                }
            };

            // Generate PDF
            await html2pdf().from(clone).set(options).save();

            // Clean up
            document.body.removeChild(tempContainer);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert('Error generating PDF: ' + error.message);
        } finally {
            // Show buttons again
            buttons.forEach(button => button.style.display = 'block');
            entryButtons.forEach(button => button.style.display = 'block');
            removeSectionButtons.forEach(button => button.style.display = 'block');
        }
    };
