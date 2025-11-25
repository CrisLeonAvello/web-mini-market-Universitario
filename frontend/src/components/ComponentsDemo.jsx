import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Skeleton, SkeletonText, SkeletonCard } from './ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';
import { Tooltip } from './ui/tooltip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Pagination, PaginationInfo } from './ui/pagination';
import { Checkbox, CheckboxWithLabel } from './ui/checkbox';
import { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel } from './ui/radio-group';
import { Switch, SwitchWithLabel } from './ui/switch';
import { Slider, SliderWithLabel } from './ui/slider';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './ui/table';

/**
 * Componente de demostración para mostrar todos los nuevos componentes UI
 * integrados desde componentFigma
 */
export default function ComponentsDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [tabValue, setTabValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Phase 3 - Advanced Components
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [priceRange, setPriceRange] = useState([5000]);
  const [volume, setVolume] = useState([50]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0e27', 
      padding: '2rem',
      color: 'white' 
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #ff6b35 0%, #a855f7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📦 Componentes UI Integrados
        </h1>

        {/* Alerts Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚨 Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Alert variant="success" onClose={() => setShowAlert(false)} autoClose={false}>
              <AlertTitle>¡Éxito!</AlertTitle>
              <AlertDescription>Tu producto se ha agregado al carrito.</AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription>Solo quedan 3 unidades en stock.</AlertDescription>
            </Alert>

            <Alert variant="error">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No se pudo procesar el pago. Intenta nuevamente.</AlertDescription>
            </Alert>

            <Alert variant="default">
              <AlertTitle>Información</AlertTitle>
              <AlertDescription>Envío gratis en compras mayores a $50.</AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Input Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📝 Inputs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <Input 
              placeholder="Email" 
              type="email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input 
              placeholder="Contraseña" 
              type="password"
            />
            <Input 
              placeholder="Campo con error" 
              error={true}
            />
            <Button onClick={() => setInputError(!inputError)}>
              Toggle Error
            </Button>
          </div>
        </section>

        {/* Avatar Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>👤 Avatars</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Avatar className={{ width: '3rem', height: '3rem' }}>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <Avatar className={{ width: '4rem', height: '4rem' }}>
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>

            <Avatar className={{ width: '2rem', height: '2rem' }}>
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
          </div>
        </section>

        {/* Skeleton Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💀 Skeletons (Loading States)</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <Button onClick={() => setLoading(!loading)}>
              {loading ? 'Ocultar Loading' : 'Mostrar Loading'}
            </Button>
          </div>
          
          {loading && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
              
              <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
                <Skeleton height="2rem" style={{ marginBottom: '1rem' }} />
                <SkeletonText lines={4} />
              </div>
            </div>
          )}
        </section>

        {/* Dialog Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💬 Dialog (Modal)</h2>
          <Button onClick={() => setDialogOpen(true)}>
            Abrir Modal
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogClose onClick={() => setDialogOpen(false)} />
              <DialogHeader>
                <DialogTitle>🎉 ¡Bienvenido!</DialogTitle>
                <DialogDescription>
                  Este es un ejemplo de modal personalizado con estilos inline.
                </DialogDescription>
              </DialogHeader>

              <div style={{ padding: '1rem 0' }}>
                <Input placeholder="Ingresa tu nombre" />
                <Input 
                  placeholder="Email" 
                  type="email" 
                  className={{ marginTop: '1rem' }}
                />
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  setDialogOpen(false);
                  alert('¡Guardado!');
                }}>
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Buttons Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔘 Buttons (ya existentes)</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="secondary">Secondary</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Select Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📋 Select (Dropdown)</h2>
          <div style={{ maxWidth: '400px' }}>
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger />
              <SelectContent>
                <SelectItem value="tecnologia">💻 Tecnología</SelectItem>
                <SelectItem value="libros">📚 Libros</SelectItem>
                <SelectItem value="audio">🎧 Audio</SelectItem>
                <SelectItem value="accesorios">🎒 Accesorios</SelectItem>
                <SelectItem value="snacks">☕ Snacks</SelectItem>
                <SelectItem value="papeleria">✏️ Papelería</SelectItem>
              </SelectContent>
            </Select>
            {selectValue && (
              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
                Seleccionado: <strong style={{ color: 'white' }}>{selectValue}</strong>
              </p>
            )}
          </div>
        </section>

        {/* Tooltip Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💡 Tooltips</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <Tooltip content="Información adicional aquí" side="top">
              <Button>Hover - Top</Button>
            </Tooltip>
            <Tooltip content="Este botón hace algo importante" side="bottom">
              <Button variant="outline">Hover - Bottom</Button>
            </Tooltip>
            <Tooltip content="Ayuda contextual" side="left">
              <Button variant="ghost">Hover - Left</Button>
            </Tooltip>
            <Tooltip content="Más detalles disponibles" side="right">
              <Button variant="secondary">Hover - Right</Button>
            </Tooltip>
          </div>
        </section>

        {/* Tabs Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📑 Tabs</h2>
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="popular">Populares</TabsTrigger>
              <TabsTrigger value="new">Nuevos</TabsTrigger>
              <TabsTrigger value="offers">Ofertas</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>📦 Todos los Productos</h3>
                <p style={{ color: '#94a3b8' }}>Mostrando todos los productos disponibles en la tienda.</p>
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 107, 53, 0.1)', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔥 Productos Populares</h3>
                <p style={{ color: '#94a3b8' }}>Los más vendidos de la semana.</p>
              </div>
            </TabsContent>
            <TabsContent value="new">
              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>✨ Productos Nuevos</h3>
                <p style={{ color: '#94a3b8' }}>Últimas incorporaciones al catálogo.</p>
              </div>
            </TabsContent>
            <TabsContent value="offers">
              <div style={{ padding: '1.5rem', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderRadius: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💰 Ofertas Especiales</h3>
                <p style={{ color: '#94a3b8' }}>Descuentos y promociones activas.</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Dropdown Menu Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📂 Dropdown Menu</h2>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Mi Cuenta ▼</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert('Perfil')}>
                  👤 Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Pedidos')}>
                  📦 Mis Pedidos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Favoritos')}>
                  ❤️ Favoritos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert('Configuración')}>
                  ⚙️ Configuración
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert('Logout')}>
                  🚪 Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline">Opciones ▼</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem>✏️ Editar</DropdownMenuItem>
                <DropdownMenuItem>📋 Duplicar</DropdownMenuItem>
                <DropdownMenuItem>🗑️ Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Pagination Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📄 Pagination</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <PaginationInfo
              currentPage={currentPage}
              totalPages={10}
              totalItems={248}
              itemsPerPage={25}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>

        {/* Checkbox Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>☑️ Checkbox</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <CheckboxWithLabel
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
              label="Acepto términos y condiciones"
              description="He leído y acepto los términos del servicio"
            />
            <CheckboxWithLabel
              checked={notifications}
              onCheckedChange={setNotifications}
              label="Notificaciones por email"
              description="Recibir ofertas y novedades"
            />
            <CheckboxWithLabel
              checked={newsletter}
              onCheckedChange={setNewsletter}
              label="Suscribirse al newsletter"
            />
          </div>
        </section>

        {/* Radio Group Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📻 Radio Group</h2>
          <div style={{ maxWidth: '500px' }}>
            <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
              <RadioGroupItemWithLabel
                value="standard"
                label="Envío Estándar"
                description="Entrega en 5-7 días hábiles - Gratis"
              />
              <RadioGroupItemWithLabel
                value="express"
                label="Envío Express"
                description="Entrega en 2-3 días hábiles - $2.500"
              />
              <RadioGroupItemWithLabel
                value="overnight"
                label="Envío Nocturno"
                description="Entrega al día siguiente - $5.000"
              />
            </RadioGroup>
          </div>
        </section>

        {/* Switch Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔘 Switch</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <SwitchWithLabel
              checked={notifications}
              onCheckedChange={setNotifications}
              label="Notificaciones Push"
              description="Recibe alertas sobre tus pedidos"
            />
            <SwitchWithLabel
              checked={newsletter}
              onCheckedChange={setNewsletter}
              label="Newsletter Semanal"
              description="Ofertas y novedades cada semana"
            />
          </div>
        </section>

        {/* Slider Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎚️ Slider</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
            <SliderWithLabel
              value={priceRange}
              onValueChange={setPriceRange}
              label="Rango de Precio"
              min={0}
              max={50000}
              step={1000}
              formatValue={(val) => `$${val.toLocaleString('es-CL')}`}
            />
            <SliderWithLabel
              value={volume}
              onValueChange={setVolume}
              label="Volumen"
              min={0}
              max={100}
              step={1}
              formatValue={(val) => `${val}%`}
            />
          </div>
        </section>

        {/* Table Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Table</h2>
          <Table>
            <TableCaption>Lista de pedidos recientes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead style={{ textAlign: 'right' }}>Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>#12345</TableCell>
                <TableCell>Laptop HP 15"</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>Entregado</span>
                </TableCell>
                <TableCell style={{ textAlign: 'right', fontWeight: '600' }}>$499.990</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#12344</TableCell>
                <TableCell>Mouse Logitech MX</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>En tránsito</span>
                </TableCell>
                <TableCell style={{ textAlign: 'right', fontWeight: '600' }}>$89.990</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>#12343</TableCell>
                <TableCell>Teclado Mecánico RGB</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    color: '#a855f7',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>Procesando</span>
                </TableCell>
                <TableCell style={{ textAlign: 'right', fontWeight: '600' }}>$149.990</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        {/* Integration Tips */}
        <section style={{ 
          backgroundColor: 'rgba(255, 107, 53, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          border: '1px solid rgba(255, 107, 53, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#ff6b35' }}>
            ✨ Componentes Integrados
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#ff6b35' }}>Fase 1 ✅</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Input</strong> - Para formularios y búsquedas</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Dialog</strong> - Modales mejorados</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Avatar</strong> - Perfiles de usuario</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Skeleton</strong> - Loading states</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Alert</strong> - Notificaciones</li>
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#a855f7' }}>Fase 2 ✅</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Select</strong> - Dropdowns para filtros</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Tooltip</strong> - Ayuda contextual</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Tabs</strong> - Organizar contenido</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Dropdown Menu</strong> - Menús de navegación</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Pagination</strong> - Navegación de páginas</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: '#22c55e' }}>Fase 3 ✅</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Checkbox</strong> - Multi-selección</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Radio Group</strong> - Opciones únicas</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Switch</strong> - Toggles y configuraciones</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Slider</strong> - Rangos y valores</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Table</strong> - Display de datos</li>
            </ul>
          </div>

          <p style={{ marginTop: '1.5rem', color: '#94a3b8' }}>
            🎨 Todos los componentes usan inline styles para mantener consistencia con tu proyecto actual.
          </p>
        </section>
      </div>
    </div>
  );
}
