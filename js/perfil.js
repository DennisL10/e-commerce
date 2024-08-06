document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('perfil-form');
    const nombreInput = document.getElementById('nombre');
    const direccionInput = document.getElementById('direccion');
    const metodoPagoInputs = document.getElementsByName('metodo-pago');
    const duiInput = document.getElementById('dui');
    const telefonoInput = document.getElementById('telefono');
    const tarjetaInfo = document.getElementById('tarjeta-info');
    const tarjetaNumeroInput = document.getElementById('numero-tarjeta');
    const tarjetaExpiracionInput = document.getElementById('fecha-vencimiento');
    const tarjetaCVVInput = document.getElementById('codigo-cvv');

    // Cargar datos del perfil desde localStorage
    const perfil = JSON.parse(localStorage.getItem('perfil')) || {};

    nombreInput.value = perfil.nombre || '';
    direccionInput.value = perfil.direccion || '';
    duiInput.value = perfil.dui || '';
    telefonoInput.value = perfil.telefono || '';

    // Establecer el método de pago
    if (perfil.metodoPago) {
        metodoPagoInputs.forEach(input => {
            if (input.value === perfil.metodoPago) {
                input.checked = true;
                if (input.value === 'tarjeta') {
                    tarjetaInfo.classList.remove('oculto');
                    // Cargar datos de la tarjeta
                    const tarjeta = JSON.parse(localStorage.getItem('tarjeta')) || {};
                    tarjetaNumeroInput.value = tarjeta.numero || '';
                    tarjetaExpiracionInput.value = tarjeta.expiracion || '';
                    tarjetaCVVInput.value = tarjeta.cvv || '';
                } else {
                    tarjetaInfo.classList.add('oculto');
                }
            }
        });
    }

    // Mostrar u ocultar campos adicionales según el método de pago seleccionado
    metodoPagoInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (document.getElementById('pago-tarjeta').checked) {
                tarjetaInfo.classList.remove('oculto');
            } else {
                tarjetaInfo.classList.add('oculto');
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener el método de pago seleccionado
        const metodoPago = Array.from(metodoPagoInputs).find(input => input.checked)?.value || '';

        // Guardar datos del perfil en localStorage
        const nuevoPerfil = {
            nombre: nombreInput.value,
            direccion: direccionInput.value,
            metodoPago: metodoPago,
            dui: duiInput.value,
            telefono: telefonoInput.value
        };

        localStorage.setItem('perfil', JSON.stringify(nuevoPerfil));

        // Guardar datos de la tarjeta si el método de pago es tarjeta
        if (metodoPago === 'tarjeta') {
            const tarjeta = {
                numero: tarjetaNumeroInput.value,
                expiracion: tarjetaExpiracionInput.value,
                cvv: tarjetaCVVInput.value
            };
            localStorage.setItem('tarjeta', JSON.stringify(tarjeta));
        } else {
            localStorage.removeItem('tarjeta');
        }

        // Usar Toastify para mostrar una notificación
        Toastify({
            text: "Perfil guardado exitosamente.",
            duration: 3000, // Duración en ms
            gravity: "top", // 'top' o 'bottom'
            position: "right", // 'left', 'center' o 'right'
            backgroundColor: "#4caf50", // Color de fondo
            stopOnFocus: true // Si el usuario enfoca la notificación, esta se detiene
        }).showToast();
    });
});
