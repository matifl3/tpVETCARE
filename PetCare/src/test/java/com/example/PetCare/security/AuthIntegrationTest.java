package com.example.PetCare.security;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Prueba el flujo completo de autenticación con JWT contra la app real
 * (Spring Security + controllers + base H2 en memoria).
 */
@SpringBootTest
class AuthIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }

    private void registrar(String email) throws Exception {
        String body = """
                {"email":"%s","password":"123456","nombre":"Ana","apellido":"Gómez",
                 "telefono":"2231234567","rol":"CLIENTE"}
                """.formatted(email);
        mvc.perform(post("/api/auth/registro").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk());
    }

    private String login(String email, String password) throws Exception {
        String body = """
                {"email":"%s","password":"%s"}
                """.formatted(email, password);
        String respuesta = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn().getResponse().getContentAsString();
        return JsonPath.read(respuesta, "$.token");
    }

    @Test
    @DisplayName("Registro → login → con el token se accede a /api/auth/me")
    void flujoCompleto() throws Exception {
        registrar("flujo@test.com");
        String token = login("flujo@test.com", "123456");

        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("flujo@test.com"))
                .andExpect(jsonPath("$.rol").value("CLIENTE"));
    }

    @Test
    @DisplayName("Sin token un endpoint protegido responde 401")
    void sinToken() throws Exception {
        mvc.perform(get("/api/mascotas/mias"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("No autenticado"));
    }

    @Test
    @DisplayName("Con un token inválido responde 401")
    void tokenInvalido() throws Exception {
        mvc.perform(get("/api/mascotas/mias").header("Authorization", "Bearer token-trucho"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Con contraseña incorrecta el login responde 401 y no da token")
    void passwordIncorrecta() throws Exception {
        registrar("mal@test.com");

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"mal@test.com\",\"password\":\"otra\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    @DisplayName("Un cliente con token válido puede ver sus mascotas pero no la lista de usuarios (solo ADMIN)")
    void permisosPorRol() throws Exception {
        registrar("rol@test.com");
        String token = login("rol@test.com", "123456");

        mvc.perform(get("/api/mascotas/mias").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        mvc.perform(get("/api/usuarios").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("El login valida que vengan email y contraseña")
    void loginSinDatos() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
    }
}
