/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.utl.dsm.controller.ControllerUsuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;

/**
 *
 * @author ramir
 */
@Path("usuario")
public class RestUsuario {

    @Path("loginEmpelado")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginEmpleado(
            @FormParam("nombre") String nombre,
            @FormParam("contrasenia") String contrasenia,
            @Context HttpServletRequest request // Agregar solicitud HTTP
    ) {
        ControllerUsuario cu = new ControllerUsuario();
        boolean valido;
        JsonObject response = new JsonObject();

        try {
            valido = cu.loginEmpleado(nombre, contrasenia);
            if (valido) {
                String token = cu.checkUser(nombre);
                // Inicia la sesión
                HttpSession session = request.getSession();
                session.setAttribute("usuario", nombre); // Almacena el usuario en la sesión

                response.addProperty("status", "success");
                response.addProperty("message", "Usuario válido");
                response.addProperty("token", token);
            } else {
                response.addProperty("status", "fail");
                response.addProperty("message", "Credenciales incorrectas");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.addProperty("status", "error");
            response.addProperty("message", "Error en el servidor");
        }

        return Response.ok(response.toString()).build();
    }

    @Path("loginCliente")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginCliente(
            @FormParam("nombre") String nombre,
            @FormParam("contrasenia") String contrasenia,
            @Context HttpServletRequest request) {
        ControllerUsuario cu = new ControllerUsuario();
        boolean valido;
        JsonObject response = new JsonObject();
        int[] clienteData = new int[1]; // Para almacenar el ID del cliente

        try {
            valido = cu.loginCliente(nombre, contrasenia, clienteData);
            if (valido) {
                HttpSession session = request.getSession();
                String token = cu.checkUser(nombre);
                session.setAttribute("usuario", nombre);

                response.addProperty("status", "success");
                response.addProperty("message", "Usuario válido");
                response.addProperty("idCliente", clienteData[0]); // ID del cliente
                response.addProperty("token", token);
            } else {
                response.addProperty("status", "fail");
                response.addProperty("message", "Credenciales incorrectas");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.addProperty("status", "error");
            response.addProperty("message", "Error en el servidor");
        }

        return Response.ok(response.toString()).build();
    }

    @Path("loginCliente1")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginCliente1(
            @FormParam("usuario") String usuario,
            @FormParam("contrasenia") String contrasenia,
            @Context HttpServletRequest request) {
        ControllerUsuario cu = new ControllerUsuario();
        boolean valido;
        JsonObject response = new JsonObject();
        int[] clienteData = new int[1]; // Para almacenar el ID del cliente

        try {
            valido = cu.loginCliente(usuario, contrasenia, clienteData);
            if (valido) {
                HttpSession session = request.getSession();
                session.setAttribute("usuario", usuario);

                response.addProperty("status", "success");
                response.addProperty("message", "Usuario válido");
                response.addProperty("idCliente", clienteData[0]); // ID del cliente
            } else {
                response.addProperty("status", "fail");
                response.addProperty("message", "Credenciales incorrectas");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.addProperty("status", "error");
            response.addProperty("message", "Error en el servidor");
        }

        return Response.ok(response.toString()).build();
    }

    @Path("cheecky")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkingUser(@QueryParam("nombreU") @DefaultValue("") String nombreU) {
        String out = null;
        String usuario = null;
        ControllerUsuario cu = new ControllerUsuario();

        try {
            usuario = cu.checkUser(nombreU);
            out = new Gson().toJson(usuario);
        } catch (Exception e) {
            out = """
                  {"error": "Por ahi no joven"}
                  """;
            System.out.println(e.getMessage());

        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("logout")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response closeCheckUser(@QueryParam("nombreU") @DefaultValue("") String nombreU) {
        String out = null;
        ControllerUsuario cu = new ControllerUsuario();
        try {
            // Llamar al método logoutUser para limpiar el token
            boolean result = cu.closeCheckUser(nombreU);

            if (result) {
                out = """
                  {"message": "Sesión cerrada exitosamente."}
                  """;
            } else {
                out = """
                  {"error": "No se pudo cerrar sesión. Usuario no encontrado."}
                  """;
            }
        } catch (Exception e) {
            out = """
              {"error": "Error interno del servidor."}
              """;
            System.out.println("Error: " + e.getMessage());
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("validateToken")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response validateToken(@QueryParam("token") String token) {
        ControllerUsuario cu = new ControllerUsuario();

        try {
            // Verifica si el token es válido
            String username = cu.validateToken(token);

            if (username != null) {
                // Token válido
                return Response.status(Response.Status.OK)
                        .entity("{\"status\": \"success\", \"username\": \"" + username + "\"}")
                        .build();
            } else {
                // Token no válido
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("{\"status\": \"error\", \"message\": \"Token no válido\"}")
                        .build();
            }
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error interno del servidor\"}")
                    .build();
        }
    }

}
