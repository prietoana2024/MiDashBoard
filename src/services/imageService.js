class ImageService {
  
  /**
   * Guarda la imagen del usuario en public/images/users
   * @param {File} imageFile - Archivo de imagen
   * @param {string} userName - Nombre del usuario
   * @returns {Promise<string>} - Ruta de la imagen guardada
   */
  
  async saveUserImage(imageFile, userName) {
    if (!imageFile || !userName) {
      throw new Error("Archivo de imagen y nombre de usuario son requeridos");
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("userName", userName);

      const response = await fetch("/api/upload-user-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir la imagen");
      }

      const result = await response.json();
      return result.imagePath;
    } catch (error) {
      console.error("Error guardando imagen:", error);
      throw error;
    }
  }

  /**
   * Obtiene la URL de la imagen del usuario
   * @param {string} userName - Nombre del usuario
   * @param {string} extension - Extensión del archivo (opcional, por defecto jpg)
   * @returns {string} - URL de la imagen
   */
  getUserImageUrl(userName, extension = "jpg") {
    if (!userName) return null;
    return `/images/users/${userName}.${extension}`;
  }

  /**
   * Verifica si existe la imagen del usuario
   * @param {string} userName - Nombre del usuario
   * @returns {Promise<boolean>} - True si existe la imagen
   */
  async checkUserImageExists(userName) {
    if (!userName) return false;
    
    try {
      const response = await fetch(this.getUserImageUrl(userName), { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Elimina la imagen del usuario
   * @param {string} userName - Nombre del usuario
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async deleteUserImage(userName) {
    if (!userName) return false;

    try {
      const response = await fetch("/api/delete-user-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      return false;
    }
  }

  /**
   * Convierte un archivo a base64
   * @param {File} file - Archivo a convertir
   * @returns {Promise<string>} - String en base64
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Valida el archivo de imagen
   * @param {File} file - Archivo a validar
   * @returns {boolean} - True si es válido
   */
  validateImageFile(file) {
    if (!file) return false;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Tipo de archivo no permitido. Use JPG, PNG o GIF.");
    }

    if (file.size > maxSize) {
      throw new Error("El archivo es demasiado grande. Máximo 5MB.");
    }

    return true;
  }
}

const imageService = new ImageService();
export default imageService;