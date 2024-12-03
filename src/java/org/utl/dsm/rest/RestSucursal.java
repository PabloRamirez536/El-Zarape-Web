package org.utl.dsm.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.dsm.controller.ControllerSucursal;
import org.utl.dsm.model.Sucursal;

@Path("sucursal")
public class RestSucursal {

    @Path("getAllSucursales")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSucursales(@QueryParam("id") @DefaultValue("0") int id) {
        List<Sucursal> lista = null;
        Gson gson = new Gson();
        String out = null;
        ControllerSucursal cs = null;

        try {
            cs = new ControllerSucursal();
            lista = cs.getAllSucursales();
            out = gson.toJson(lista);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"result":"Error de servidor"}
              """;
        }
        return Response.ok(out).build();
    }

    @Path("insertSucursal")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response insertSucursal(@FormParam("datosSucursal") @DefaultValue("") String datosSucursal) {
        String out;
        try {
            Gson gson = new Gson();
            ControllerSucursal controllerSucursales = new ControllerSucursal();

            // Convertir el JSON recibido a un objeto Sucursal
            Sucursal sucursal = gson.fromJson(datosSucursal, Sucursal.class);

            // Llamar al método para insertar la sucursal
            controllerSucursales.insertSucursal(sucursal);

            // Convertir la sucursal nuevamente a JSON para la respuesta
            out = gson.toJson(sucursal);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"" + e.getMessage() + "\"}"; // El error se captura y muestra en el mensaje
        }
        return Response.ok(out).build();
    }

    @Path("updateSucursal")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response updateSucursal(@FormParam("datosSucursal") @DefaultValue("") String datosSucursal) {
        String out = "";
        try {
            Gson gson = new Gson();
            ControllerSucursal controllerSucursales = new ControllerSucursal();

            // Convertir el JSON recibido a un objeto sucursal
            Sucursal sucursales = gson.fromJson(datosSucursal, Sucursal.class);

            // Llamar al método para actualizar la sucursal
            sucursales = controllerSucursales.updateSucursal(sucursales);

            // Convertir el objeto sucursal actualizado a JSON para la respuesta
            out = gson.toJson(sucursales);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"error\":\"Error al actualizar la sucursal. Por favor, verifica los datos y vuelve a intentarlo.\"}";
        }
        return Response.ok(out).build();
    }

    @Path("deleteSucursal")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response deleteSucursal(@FormParam("idSucursal") int idSucursal) {
        ControllerSucursal controller = new ControllerSucursal();
        try {
            controller.deleteSucursal(idSucursal); // Llamada a la función de eliminación lógica
            // Asegúrate de que el mensaje sea claro y esté en formato JSON
            return Response.ok("{\"result\":\"Sucursal eliminada correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            // Aquí enviamos el mensaje de error en formato JSON
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"result\":\"Error al eliminar la sucursal\"}")
                    .build();
        }
    }

}
