import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  Check,
  CreditCard,
  Crown,
  DollarSign,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
} from 'lucide-react';
import {
  ConnectionError,
  PlanWithVariants,
  Subscription,
  UsageStats,
  billingApi,
  calculateSavings,
  formatCredits,
  formatPrice,
  getStatusColor,
  getStatusText,
  parsePlanFeatures,
} from '../services/billingService';
import { useAuthStore } from '../store/authStore';
import { formatToUserTimezone } from '../utils/timezone';

const SubscriptionPage = () => {
  const { userEmail } = useAuthStore();
  const [plans, setPlans] = useState<PlanWithVariants[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    planId: number;
    variantId: number;
    period: 'monthly' | 'annual';
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if user is admin
  const isAdmin = userEmail === 'cramtek@hotmail.com';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    setConnectionError(false);

    try {
      // Load plans
      const plansResponse = await billingApi.getPlans();
      if (plansResponse.success) {
        setPlans(plansResponse.plans);
      }

      // Try to load current subscription
      try {
        const subscriptionResponse = await billingApi.getSubscription();
        if (subscriptionResponse.success) {
          setSubscription(subscriptionResponse.subscription);

          // Load usage if subscription exists
          const usageResponse = await billingApi.getUsage();
          if (usageResponse.success) {
            setUsage(usageResponse.usage);
          }
        }
      } catch (subError) {
        // No subscription exists, which is fine for new users
        console.log('No active subscription found');
      }
    } catch (error) {
      console.error('Error loading billing data:', error);

      // Check if it's a connection error using our custom error class
      if (error instanceof ConnectionError) {
        setConnectionError(true);
        setError(error.message);
      } else if (error instanceof Error) {
        // Check for other connection-related errors
        const message = error.message.toLowerCase();
        if (
          message.includes('failed to fetch') ||
          message.includes('networkerror') ||
          message.includes('network error') ||
          message.includes('connection') ||
          message.includes('timeout') ||
          message.includes('cors')
        ) {
          setConnectionError(true);
          setError(
            'No se pudo conectar con el servidor de facturación. Verifica tu conexión a internet e inténtalo de nuevo.',
          );
        } else {
          setError(error.message || 'Error al cargar datos de facturación');
        }
      } else {
        setError('Error desconocido al cargar datos de facturación');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = (planId: number, variantId: number, period: 'monthly' | 'annual') => {
    if (connectionError) {
      setError(
        'No se puede seleccionar un plan sin conexión al servidor. Verifica tu conexión e inténtalo de nuevo.',
      );
      return;
    }
    setSelectedPlan({ planId, variantId, period });
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || isProcessing || connectionError) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await billingApi.createSubscription({
        variant_id: selectedPlan.variantId,
        billing_period: selectedPlan.period,
      });

      if (response.success && response.data.requires_payment) {
        // Initialize OnvoPay payment
        await initializeOnvoPayment(response.data);
      } else {
        // Subscription created without payment required
        await loadData();
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Error creating subscription:', error);

      if (error instanceof ConnectionError) {
        setConnectionError(true);
        setError(error.message);
      } else if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes('failed to fetch') ||
          message.includes('connection') ||
          message.includes('network')
        ) {
          setConnectionError(true);
          setError(
            'No se pudo procesar la suscripción. Verifica tu conexión a internet e inténtalo de nuevo.',
          );
        } else {
          setError(error.message || 'Error al crear suscripción');
        }
      } else {
        setError('Error desconocido al crear suscripción');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeOnvoPayment = async (paymentData: any) => {
    try {
      // Load OnvoPay script if not already loaded
      if (!window.OnvoPay) {
        await loadOnvoPayScript();
      }

      // Initialize OnvoPay checkout
      const onvoPay = new window.OnvoPay(paymentData.public_key);

      const result = await onvoPay.confirmPayment({
        payment_intent_id: paymentData.payment_intent_id,
        return_url: window.location.href,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Payment successful, reload data
      await loadData();
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar el pago');
    }
  };

  const loadOnvoPayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.OnvoPay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.onvopay.com/v1/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load OnvoPay script'));
      document.head.appendChild(script);
    });
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'básico':
        return <Zap className="h-8 w-8" />;
      case 'medio':
        return <Star className="h-8 w-8" />;
      case 'premium':
        return <Crown className="h-8 w-8" />;
      default:
        return <CreditCard className="h-8 w-8" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'básico':
        return 'from-blue-500 to-cyan-500';
      case 'medio':
        return 'from-purple-500 to-pink-500';
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de suscripción...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show connection error state
  if (connectionError && plans.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-6">
            <WifiOff className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Problema de Conexión</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            No se pudo conectar con el servidor de facturación. Verifica tu conexión a internet.
          </p>
        </div>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 mb-2">Error de Conectividad</h3>
              <p className="text-sm text-red-700 mb-4">
                {error || 'No se pudo establecer conexión con el servidor de facturación.'}
              </p>
              <div className="space-y-2 text-sm text-red-600">
                <p>• Verifica que tengas conexión a internet</p>
                <p>• Comprueba que no haya un firewall bloqueando la conexión</p>
                <p>• El servidor podría estar temporalmente no disponible</p>
                <p>• Si el problema persiste, contacta al soporte técnico</p>
              </div>
            </div>
          </div>
        </div>

        {/* Retry Button */}
        <div className="text-center">
          <button
            onClick={loadData}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reintentar Conexión
          </button>
        </div>

        {/* Offline Plans Preview */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Planes Disponibles</h2>
            <p className="text-gray-600">Vista previa de nuestros planes de suscripción</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                <p className="text-gray-600 mb-6">Perfecto para empezar</p>
                <div className="text-3xl font-bold text-gray-900 mb-2">$29/mes</div>
                <p className="text-gray-500 text-sm mb-6">o $290/año (ahorra 17%)</p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />1 asistente
                  </div>
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    10K créditos incluidos
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Plan */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
                  <Star className="h-4 w-4 mr-1" />
                  Más Popular
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white mb-4">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Medio</h3>
                <p className="text-gray-600 mb-6">Para negocios en crecimiento</p>
                <div className="text-3xl font-bold text-gray-900 mb-2">$79/mes</div>
                <p className="text-gray-500 text-sm mb-6">o $790/año (ahorra 17%)</p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />3 asistentes
                  </div>
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    30K créditos incluidos
                  </div>
                  <div className="flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Soporte prioritario
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl text-white mb-4">
                  <Crown className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600 mb-6">Para empresas establecidas</p>
                <div className="text-3xl font-bold text-gray-900 mb-2">$199/mes</div>
                <p className="text-gray-500 text-sm mb-6">o $1990/año (ahorra 17%)</p>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2" />
                    10 asistentes
                  </div>
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    100K créditos incluidos
                  </div>
                  <div className="flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Soporte prioritario
                  </div>
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Branding personalizado
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Conecta a internet para acceder a todas las funcionalidades de suscripción
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
          <CreditCard className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Gestión de Suscripción</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Administra tu plan, créditos y facturación de LetParley
        </p>

        {/* Connection Status */}
        {connectionError && (
          <div className="mt-4 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <WifiOff className="h-4 w-4 mr-2" />
            Conexión limitada
          </div>
        )}

        {/* Admin Panel Button */}
        {isAdmin && (
          <div className="mt-6">
            <button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Settings className="h-4 w-4 mr-2" />
              Panel de Administración
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
            {connectionError && (
              <button
                onClick={loadData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Reintentar conexión
              </button>
            )}
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Suscripción Actual</h2>
            <button
              onClick={loadData}
              disabled={connectionError}
              className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-4">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${getPlanColor(subscription.plan_name)} rounded-xl text-white`}
                >
                  {getPlanIcon(subscription.plan_name)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{subscription.plan_name}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subscription.status)}`}
                    >
                      {getStatusText(subscription.status)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{subscription.plan_description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Período:</span>
                      <span className="ml-2 text-gray-600">
                        {subscription.billing_period === 'monthly' ? 'Mensual' : 'Anual'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Precio:</span>
                      <span className="ml-2 text-gray-600">
                        {formatPrice(
                          subscription.billing_period === 'monthly'
                            ? subscription.monthly_price
                            : subscription.annual_price,
                        )}
                        /{subscription.billing_period === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Próxima facturación:</span>
                      <span className="ml-2 text-gray-600">
                        {formatToUserTimezone(subscription.next_billing_date, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Créditos incluidos:</span>
                      <span className="ml-2 text-gray-600">
                        {formatCredits(subscription.credits_included)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            {usage && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Uso de Créditos</h4>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Utilizados</span>
                      <span className="font-medium text-gray-900">
                        {formatCredits(usage.credits_used)} /{' '}
                        {formatCredits(usage.credits_included)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usage.usage_percentage, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {usage.usage_percentage.toFixed(1)}% utilizado
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Restantes:</span>
                        <span className="font-medium text-green-600">
                          {formatCredits(usage.credits_remaining)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Período actual:</span>
                        <span className="text-gray-900">
                          {formatToUserTimezone(usage.period_start, {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          -
                          {formatToUserTimezone(usage.period_end, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {subscription ? 'Cambiar Plan' : 'Selecciona tu Plan'}
          </h2>
          <p className="text-gray-600">
            {subscription
              ? 'Actualiza o cambia tu suscripción actual'
              : 'Elige el plan que mejor se adapte a las necesidades de tu negocio'}
          </p>
          {connectionError && (
            <p className="text-yellow-600 text-sm mt-2">
              Funcionalidad limitada sin conexión al servidor
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((planData) => {
            const { plan, variants } = planData;
            const features = parsePlanFeatures(plan.features_json);

            return (
              <div key={plan.plan_id} className="relative">
                {/* Popular badge for middle plan */}
                {plan.plan_name.toLowerCase() === 'medio' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
                      <Star className="h-4 w-4 mr-1" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div
                  className={`
                  bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg
                  ${plan.plan_name.toLowerCase() === 'medio' ? 'border-purple-200 shadow-lg' : 'border-gray-100'}
                  ${connectionError ? 'opacity-75' : ''}
                `}
                >
                  {/* Plan Header */}
                  <div className="p-8 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${getPlanColor(plan.plan_name)} rounded-xl text-white mb-4`}
                    >
                      {getPlanIcon(plan.plan_name)}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan_name}</h3>
                    <p className="text-gray-600 mb-6">{plan.plan_description}</p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {features.max_assistants} asistente{features.max_assistants > 1 ? 's' : ''}
                      </div>
                      {features.priority_support && (
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <Shield className="h-4 w-4 mr-2" />
                          Soporte prioritario
                        </div>
                      )}
                      {features.custom_branding && (
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Branding personalizado
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="px-8 pb-8 space-y-4">
                    {variants.map((variant) => {
                      const savings = calculateSavings(
                        variant.monthly_price_usd,
                        variant.annual_price_usd,
                      );

                      return (
                        <div key={variant.variant_id} className="space-y-3">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {formatCredits(variant.credit_amount)} créditos
                            </div>
                          </div>

                          {/* Monthly Option */}
                          <button
                            onClick={() =>
                              handleSelectPlan(plan.plan_id, variant.variant_id, 'monthly')
                            }
                            disabled={connectionError}
                            className={`
                              w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                              ${
                                selectedPlan?.variantId === variant.variant_id &&
                                selectedPlan?.period === 'monthly'
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }
                              ${connectionError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {formatPrice(variant.monthly_price_usd)}/mes
                                </div>
                                <div className="text-sm text-gray-600">Facturación mensual</div>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </button>

                          {/* Annual Option */}
                          <button
                            onClick={() =>
                              handleSelectPlan(plan.plan_id, variant.variant_id, 'annual')
                            }
                            disabled={connectionError}
                            className={`
                              w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative
                              ${
                                selectedPlan?.variantId === variant.variant_id &&
                                selectedPlan?.period === 'annual'
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }
                              ${connectionError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                            `}
                          >
                            {savings > 0 && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{savings.toFixed(0)}%
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {formatPrice(variant.annual_price_usd)}/año
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatPrice(variant.annual_price_usd / 12)}/mes
                                </div>
                              </div>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscribe Button */}
        {selectedPlan && !connectionError && (
          <div className="mt-8 text-center">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing || connectionError}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold text-lg shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-3" />
                  {subscription ? 'Cambiar Plan' : 'Suscribirse Ahora'}
                </>
              )}
            </button>
          </div>
        )}

        {/* Connection Required Message */}
        {selectedPlan && connectionError && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-yellow-100 text-yellow-800 rounded-lg">
              <WifiOff className="h-5 w-5 mr-2" />
              Se requiere conexión a internet para procesar suscripciones
            </div>
          </div>
        )}
      </div>

      {/* Admin Panel */}
      {isAdmin && showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} onUpdate={loadData} />
      )}
    </div>
  );
};

// Admin Panel Component (only visible to cramtek@hotmail.com)
const AdminPanel = ({ onClose, onUpdate }: { onClose: () => void; onUpdate: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Panel de Administración</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Funcionalidad en Desarrollo</h3>
                <p className="text-sm text-red-700 mt-1">
                  El panel de administración para gestionar planes y precios está en desarrollo. Por
                  ahora, los planes se gestionan directamente en la base de datos.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gestión de Planes y Precios</h3>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad estará disponible próximamente para administrar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-4">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Crear Planes</h4>
                <p className="text-sm text-gray-600">Agregar nuevos planes de suscripción</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <DollarSign className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Gestionar Precios</h4>
                <p className="text-sm text-gray-600">Modificar precios y variantes</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Activar/Desactivar</h4>
                <p className="text-sm text-gray-600">Controlar disponibilidad de planes</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Configurar Créditos</h4>
                <p className="text-sm text-gray-600">Ajustar cantidades de créditos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Declare OnvoPay global
declare global {
  interface Window {
    OnvoPay: any;
  }
}

export default SubscriptionPage;
