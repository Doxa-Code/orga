import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Client, FollowUp, NextStep } from "@/types/kanban";
import {
  Building2,
  Calendar,
  Check,
  Mail,
  Paperclip,
  Phone,
  Plus,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ClientModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient: (updatedClient: Client) => void;
}

export const ModalFollowUp: React.FC<ClientModalProps> = ({
  client,
  isOpen,
  onClose,
  onUpdateClient,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "followups" | "nextsteps"
  >("followups");
  const [newFollowUp, setNewFollowUp] = useState({
    type: "call" as "call" | "email" | "meeting" | "other",
    notes: "",
    outcome: "",
  });
  const [newNextStep, setNewNextStep] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [showAddFollowUp, setShowAddFollowUp] = useState(false);
  const [showAddNextStep, setShowAddNextStep] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleAddFollowUp = () => {
    if (newFollowUp.notes.trim()) {
      const followUp: FollowUp = {
        id: Date.now().toString(),
        date: new Date(),
        type: newFollowUp.type,
        notes: newFollowUp.notes,
        outcome: newFollowUp.outcome,
      };

      const updatedClient: Client = {
        ...client,
        followUps: [...client.followUps, followUp],
        lastContact: new Date(),
      };

      onUpdateClient(updatedClient);
      console.log("Follow-up adicionado:", followUp);
      console.log("Arquivos anexados:", uploadedFiles);

      setNewFollowUp({ type: "call", notes: "", outcome: "" });
      setUploadedFiles([]);
      setShowAddFollowUp(false);
    }
  };

  const handleAddNextStep = () => {
    if (newNextStep.title.trim()) {
      const nextStep: NextStep = {
        id: Date.now().toString(),
        title: newNextStep.title,
        description: newNextStep.description,
        dueDate: newNextStep.dueDate
          ? new Date(newNextStep.dueDate)
          : new Date(),
        priority: newNextStep.priority,
        completed: false,
      };

      const updatedClient: Client = {
        ...client,
        nextSteps: [...client.nextSteps, nextStep],
      };

      onUpdateClient(updatedClient);
      console.log("Próximo passo adicionado:", nextStep);

      setNewNextStep({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });
      setShowAddNextStep(false);
    }
  };

  const handleToggleNextStep = (stepId: string) => {
    const updatedNextSteps = client.nextSteps.map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step,
    );

    const updatedClient: Client = {
      ...client,
      nextSteps: updatedNextSteps,
    };

    onUpdateClient(updatedClient);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFollowUpIcon = (type: string) => {
    switch (type) {
      case "call":
        return "📞";
      case "email":
        return "📧";
      case "meeting":
        return "🤝";
      default:
        return "📝";
    }
  };

  const getFollowUpTypeLabel = (type: string) => {
    switch (type) {
      case "call":
        return "Ligação";
      case "email":
        return "Email";
      case "meeting":
        return "Reunião";
      default:
        return "Outro";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {client.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full gap-6">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("followups")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "followups"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Follow-ups ({client.followUps.length})
              </button>
              <button
                onClick={() => setActiveTab("nextsteps")}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === "nextsteps"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Próximos Passos (
                {client.nextSteps.filter((step) => !step.completed).length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Follow-ups Tab - Chat Design */}
              {activeTab === "followups" && (
                <div className="flex flex-col h-full">
                  {/* Chat Messages Container */}
                  <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                    {client.followUps.map((followUp, index) => (
                      <div key={followUp.id} className="flex items-start gap-3">
                        {/* Avatar/Icon */}
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">
                            {getFollowUpIcon(followUp.type)}
                          </span>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 max-w-3xl">
                          {/* Header */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {getFollowUpTypeLabel(followUp.type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDate(followUp.date)} às{" "}
                              {formatTime(followUp.date)}
                            </span>
                          </div>

                          {/* Content Card */}
                          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">
                                  Notas:
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {followUp.notes}
                                </p>
                              </div>

                              {followUp.outcome && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                                    Resultado:
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {followUp.outcome}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* New Follow-up Input */}
                  <div className="border-t border-gray-200 pt-4">
                    {!showAddFollowUp ? (
                      <Button
                        onClick={() => setShowAddFollowUp(true)}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Follow-up
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        {/* Type Selection */}
                        <Select
                          value={newFollowUp.type}
                          onValueChange={(value) =>
                            setNewFollowUp({
                              ...newFollowUp,
                              type: value as any,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de contato" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">📞 Ligação</SelectItem>
                            <SelectItem value="email">📧 Email</SelectItem>
                            <SelectItem value="meeting">🤝 Reunião</SelectItem>
                            <SelectItem value="other">📝 Outro</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Notes Field with File Upload */}
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Digite suas notas aqui..."
                            value={newFollowUp.notes}
                            onChange={(e) =>
                              setNewFollowUp({
                                ...newFollowUp,
                                notes: e.target.value,
                              })
                            }
                            className="min-h-[100px]"
                          />

                          {/* File Upload Area */}
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept="image/*,.pdf,.doc,.docx,.txt"
                            />
                            <label
                              htmlFor="file-upload"
                              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <Paperclip className="w-4 h-4" />
                              Anexar arquivo
                            </label>
                          </div>

                          {/* Uploaded Files Display */}
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-700">
                                      {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => removeFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Outcome Field */}
                        <Input
                          placeholder="Resultado/Próximos passos..."
                          value={newFollowUp.outcome}
                          onChange={(e) =>
                            setNewFollowUp({
                              ...newFollowUp,
                              outcome: e.target.value,
                            })
                          }
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button onClick={handleAddFollowUp} size="sm">
                            Salvar Follow-up
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddFollowUp(false);
                              setUploadedFiles([]);
                              setNewFollowUp({
                                type: "call",
                                notes: "",
                                outcome: "",
                              });
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Steps Tab */}
              {activeTab === "nextsteps" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Próximos Passos
                    </h3>
                    <Button onClick={() => setShowAddNextStep(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Passo
                    </Button>
                  </div>

                  {showAddNextStep && (
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <Input
                        placeholder="Título do próximo passo..."
                        value={newNextStep.title}
                        onChange={(e) =>
                          setNewNextStep({
                            ...newNextStep,
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Descrição detalhada..."
                        value={newNextStep.description}
                        onChange={(e) =>
                          setNewNextStep({
                            ...newNextStep,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="date"
                          value={newNextStep.dueDate}
                          onChange={(e) =>
                            setNewNextStep({
                              ...newNextStep,
                              dueDate: e.target.value,
                            })
                          }
                        />
                        <Select
                          value={newNextStep.priority}
                          onValueChange={(value) =>
                            setNewNextStep({
                              ...newNextStep,
                              priority: value as any,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddNextStep} size="sm">
                          Salvar
                        </Button>
                        <Button
                          onClick={() => setShowAddNextStep(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {client.nextSteps.map((step) => (
                      <div
                        key={step.id}
                        className={`border rounded-lg p-4 ${step.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleNextStep(step.id)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                step.completed
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {step.completed && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </button>
                            <div>
                              <h4
                                className={`font-medium ${step.completed ? "text-green-800 line-through" : "text-gray-900"}`}
                              >
                                {step.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {formatDate(step.dueDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge className={getPriorityColor(step.priority)}>
                            {step.priority === "high"
                              ? "Alta"
                              : step.priority === "medium"
                                ? "Média"
                                : "Baixa"}
                          </Badge>
                        </div>
                        <p
                          className={`text-sm ${step.completed ? "text-green-700" : "text-gray-600"}`}
                        >
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Overview */}
          <div className="w-80 bg-gray-50 rounded-lg p-4 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Visão Geral</h3>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Informações de Contato
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{client.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {client.company}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Informações Comerciais
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Valor do Negócio
                  </span>
                  <p className="text-xl font-bold text-green-600">
                    R$ {client.value.toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Status
                  </span>
                  <p className="text-sm font-medium">{client.status}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Cliente desde
                  </span>
                  <p className="text-sm">{formatDate(client.createdAt)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    Último contato
                  </span>
                  <p className="text-sm">{formatDate(client.lastContact)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Resumo
              </h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-lg font-bold text-blue-600">
                    {client.followUps.length}
                  </p>
                  <p className="text-xs text-gray-500">Follow-ups</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-lg font-bold text-orange-600">
                    {client.nextSteps.filter((step) => !step.completed).length}
                  </p>
                  <p className="text-xs text-gray-500">Próximos Passos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
