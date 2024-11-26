/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.dsm.rest;

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
import jakarta.ws.rs.GET;
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
                // Inicia la sesión
                HttpSession session = request.getSession();
                session.setAttribute("usuario", nombre); // Almacena el usuario en la sesión

                response.addProperty("status", "success");
                response.addProperty("message", "Usuario válido");
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
                session.setAttribute("usuario", nombre);

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

}
