-- ============================================================
-- PETCARE - DATOS DE PRUEBA
-- Ejecutar TODO en MySQL (después de que la app haya arrancado
-- al menos una vez para crear las tablas)
-- ============================================================

-- 1. PRODUCTOS
INSERT INTO producto (nombre, descripcion, precio, stock, categoria, activo) VALUES
('Alimento Balanceado Perro Adulto 20kg', 'Alimento completo para perros adultos de razas medianas y grandes.', 45000, 50, 'Alimentos', TRUE),
('Alimento Balanceado Gato Adulto 7kg', 'Alimento premium para gatos adultos.', 32000, 40, 'Alimentos', TRUE),
('Alimento Humedo Perro Latas 400g', 'Paquete x12 latas de alimento humedo para perros.', 24000, 30, 'Alimentos', TRUE),
('Alimento Balanceado Perro Cachorro 15kg', 'Alimento especialmente formulado para cachorros.', 38000, 35, 'Alimentos', TRUE),
('Shampoo para Perros 500ml', 'Shampoo neutro para el bano de perros y gatos.', 8500, 60, 'Higiene', TRUE),
('Cepillo de Cerdas Suaves', 'Cepillo ideal para el cepillado diario de mascotas de pelo corto.', 4500, 80, 'Higiene', TRUE),
('Cornauas Profesional', 'Cornauas de acero inoxidable para mascotas pequenas y medianas.', 6200, 45, 'Higiene', TRUE),
('Juguete Pelota con Sonido', 'Pelota resistente con sonido interior para horas de juego.', 3500, 100, 'Juguetes', TRUE),
('Hueso de Goma para Morder', 'Hueso de goma resistente ideal para perros que muerden fuerte.', 4200, 75, 'Juguetes', TRUE),
('Rascador para Gatos Torre', 'Torre rascador de 80cm con plataforma y juguete colgante.', 28000, 15, 'Juguetes', TRUE),
('Cama Tipo Cojin 80x60cm', 'Cama acolchonada para mascotas pequenas y medianas.', 18500, 20, 'Accesorios', TRUE),
('Comedero Doble Acero', 'Comedero doble de acero inoxidable con base antideslizante.', 7200, 55, 'Accesorios', TRUE),
('Correa Reflectiva 120cm', 'Correa con costuras reflectivas para paseos nocturnos.', 5800, 65, 'Accesorios', TRUE),
('Collar Ajustable con Identificacion', 'Collar de nylon ajustable con placa para datos.', 4200, 70, 'Accesorios', TRUE),
('Transportador para Mascotas', 'Transportador rigido aprobado para viajes en avion.', 35000, 12, 'Accesorios', TRUE),
('Antipulgas Spot On Perros 3 pipetas', 'Tratamiento antipulgas y garrapatas para perros de hasta 15kg.', 12500, 40, 'Salud', TRUE),
('Vitaminas para Perros 60 comprimidos', 'Suplemento vitaminico para perros adultos.', 9800, 35, 'Salud', TRUE),
('Arnes de Seguridad para Auto', 'Arnes homologado para viajar seguro en auto con tu mascota.', 15000, 25, 'Accesorios', TRUE);

-- 2. USUARIOS SPRING SECURITY (contraseña: 123456)
INSERT INTO users (username, password, enabled) VALUES
('carlos@petcare.com', '{bcrypt}$2a$10$qXCur8Hh..wOoLeWoxyVzuIZLCxiibTiwB8KJhPjqxtu43ZfY0zNi', TRUE),
('laura@petcare.com', '{bcrypt}$2a$10$qXCur8Hh..wOoLeWoxyVzuIZLCxiibTiwB8KJhPjqxtu43ZfY0zNi', TRUE),
('martin@petcare.com', '{bcrypt}$2a$10$qXCur8Hh..wOoLeWoxyVzuIZLCxiibTiwB8KJhPjqxtu43ZfY0zNi', TRUE),
('sofia@petcare.com', '{bcrypt}$2a$10$qXCur8Hh..wOoLeWoxyVzuIZLCxiibTiwB8KJhPjqxtu43ZfY0zNi', TRUE),
('pedro@petcare.com', '{bcrypt}$2a$10$qXCur8Hh..wOoLeWoxyVzuIZLCxiibTiwB8KJhPjqxtu43ZfY0zNi', TRUE);

-- 3. ROLES SPRING SECURITY
INSERT INTO authorities (username, authority) VALUES
('carlos@petcare.com', 'ROLE_VETERINARIO'),
('laura@petcare.com', 'ROLE_PASEADOR'),
('martin@petcare.com', 'ROLE_PELUQUERO'),
('sofia@petcare.com', 'ROLE_ADIESTRADOR'),
('pedro@petcare.com', 'ROLE_CUIDADOR');

-- 4. PROFESIONALES EN TABLA JPA (dtype = 'Profesional' por herencia)
INSERT INTO usuario (dtype, nombre, apellido, email, telefono, rol, activo, matricula, experiencia, estado) VALUES
('Profesional', 'Carlos', 'Garcia', 'carlos@petcare.com', '1160001111', 'VETERINARIO', TRUE, 'MN 12345', '10 anos como veterinario clinico.', 'APROBADO'),
('Profesional', 'Laura', 'Martinez', 'laura@petcare.com', '1160002222', 'PASEADOR', TRUE, 'P-2023-001', '3 anos como paseadora profesional.', 'APROBADO'),
('Profesional', 'Martin', 'Rodriguez', 'martin@petcare.com', '1160003333', 'PELUQUERO', TRUE, 'PEL-5678', '5 anos en peluqueria canina.', 'APROBADO'),
('Profesional', 'Sofia', 'Lopez', 'sofia@petcare.com', '1160004444', 'ADIESTRADOR', TRUE, 'AD-9012', '7 anos como adiestradora profesional.', 'APROBADO'),
('Profesional', 'Pedro', 'Fernandez', 'pedro@petcare.com', '1160005555', 'CUIDADOR', TRUE, 'CUI-3456', '4 anos en guarderia y cuidado de mascotas.', 'APROBADO');
