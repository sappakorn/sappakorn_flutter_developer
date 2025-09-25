/**
 * Component Loader - โหลด HTML components แบบ dynamic
 */
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    /**
     * โหลด component จากไฟล์ HTML
     * @param {string} componentName - ชื่อ component
     * @param {string} filePath - path ของไฟล์ component
     * @returns {Promise<string>} - HTML content ของ component
     */
    async loadComponent(componentName, filePath) {
        try {
            // ตรวจสอบว่า component ถูกโหลดแล้วหรือไม่
            if (this.components.has(componentName)) {
                return this.components.get(componentName);
            }

            // โหลด component จากไฟล์
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentName} from ${filePath}`);
            }

            const html = await response.text();
            
            // เก็บ component ใน cache
            this.components.set(componentName, html);
            this.loadedComponents.add(componentName);

            console.log(`✅ Component loaded: ${componentName}`);
            return html;
        } catch (error) {
            console.error(`❌ Error loading component ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * แทรก component เข้าไปใน DOM element
     * @param {string} targetSelector - CSS selector ของ element ที่จะแทรก component
     * @param {string} componentName - ชื่อ component
     * @param {string} filePath - path ของไฟล์ component
     * @param {string} insertMethod - วิธีการแทรก ('innerHTML', 'insertAdjacentHTML')
     * @param {string} position - ตำแหน่งสำหรับ insertAdjacentHTML ('beforeend', 'afterbegin', etc.)
     */
    async insertComponent(targetSelector, componentName, filePath, insertMethod = 'innerHTML', position = 'beforeend') {
        try {
            const targetElement = document.querySelector(targetSelector);
            if (!targetElement) {
                throw new Error(`Target element not found: ${targetSelector}`);
            }

            const componentHTML = await this.loadComponent(componentName, filePath);

            if (insertMethod === 'innerHTML') {
                targetElement.innerHTML = componentHTML;
            } else if (insertMethod === 'insertAdjacentHTML') {
                targetElement.insertAdjacentHTML(position, componentHTML);
            }

            console.log(`✅ Component inserted: ${componentName} into ${targetSelector}`);
        } catch (error) {
            console.error(`❌ Error inserting component ${componentName}:`, error);
            throw error;
        }
    }

    /**
     * โหลด components หลายตัวพร้อมกัน
     * @param {Array} componentConfigs - array ของ config objects
     * @returns {Promise<void>}
     */
    async loadMultipleComponents(componentConfigs) {
        const loadPromises = componentConfigs.map(config => {
            const { targetSelector, componentName, filePath, insertMethod, position } = config;
            return this.insertComponent(targetSelector, componentName, filePath, insertMethod, position);
        });

        try {
            await Promise.all(loadPromises);
            console.log('✅ All components loaded successfully');
        } catch (error) {
            console.error('❌ Error loading multiple components:', error);
            throw error;
        }
    }

    /**
     * ตรวจสอบว่า component ถูกโหลดแล้วหรือไม่
     * @param {string} componentName - ชื่อ component
     * @returns {boolean}
     */
    isComponentLoaded(componentName) {
        return this.loadedComponents.has(componentName);
    }

    /**
     * ล้าง cache ของ component
     * @param {string} componentName - ชื่อ component (ถ้าไม่ระบุจะล้างทั้งหมด)
     */
    clearCache(componentName = null) {
        if (componentName) {
            this.components.delete(componentName);
            this.loadedComponents.delete(componentName);
            console.log(`🗑️ Cache cleared for component: ${componentName}`);
        } else {
            this.components.clear();
            this.loadedComponents.clear();
            console.log('🗑️ All component cache cleared');
        }
    }

    /**
     * รีโหลด component
     * @param {string} targetSelector - CSS selector ของ element ที่จะแทรก component
     * @param {string} componentName - ชื่อ component
     * @param {string} filePath - path ของไฟล์ component
     */
    async reloadComponent(targetSelector, componentName, filePath) {
        this.clearCache(componentName);
        await this.insertComponent(targetSelector, componentName, filePath);
    }

    /**
     * ดูรายการ components ที่โหลดแล้ว
     * @returns {Array<string>}
     */
    getLoadedComponents() {
        return Array.from(this.loadedComponents);
    }
}

// Export สำหรับใช้งาน
export default ComponentLoader;