
package org.utl.dsm.rest;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import org.utl.dsm.controller.ControllerTicket;
import org.utl.dsm.model.DetalleTicket;

/**
 *
 * @author ramir
 */

@Path("pago")
public class RestTicket {

    @Path("pagoComanda")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response procesarPago(String jsonBody) {
        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();

        try {
            JsonObject json = gson.fromJson(jsonBody, JsonObject.class);
            int idCliente = json.get("idCliente").getAsInt();
            int idSucursal = json.get("idSucursal").getAsInt();
            JsonArray productos = json.getAsJsonArray("productos");

            ControllerTicket controller = new ControllerTicket();
            int idTicket = controller.registrarTicket(idCliente, idSucursal);

            if (idTicket > 0) {
                List<DetalleTicket> detalles = new ArrayList<>();
                for (int i = 0; i < productos.size(); i++) {
                    JsonObject obj = productos.get(i).getAsJsonObject();
                    DetalleTicket detalle = new DetalleTicket();
                    detalle.setIdTicket(idTicket);
                    detalle.setCantidad(obj.get("cantidad").getAsInt());
                    detalle.setPrecio(obj.get("precio").getAsDouble());

                    if (obj.has("idCombo") && !obj.get("idCombo").isJsonNull()) {
                        detalle.setIdCombo(obj.get("idCombo").getAsInt());
                        detalle.setIdProducto(0);
                    } else {
                        detalle.setIdCombo(1);
                        detalle.setIdProducto(obj.get("idProducto").getAsInt());
                    }
                    detalles.add(detalle);
                }

                controller.registrarDetalleTicket(idTicket, detalles);
                controller.registrarComanda(idTicket);

                responseJson.addProperty("mensaje", "Pago procesado con éxito");
                responseJson.addProperty("idTicket", idTicket);
                return Response.ok(gson.toJson(responseJson)).build();
            } else {
                responseJson.addProperty("error", "No se pudo procesar el pago");
                return Response.status(Response.Status.BAD_REQUEST).entity(gson.toJson(responseJson)).build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            responseJson.addProperty("error", "Error interno en el servidor: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(gson.toJson(responseJson)).build();
        }
    }
}
